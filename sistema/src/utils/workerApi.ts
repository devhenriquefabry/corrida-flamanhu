import { auth } from '../firebase';

// Rotas /public/* do worker (backend/worker/src/publicApi.js): o que o site
// público precisa saber sobre inscrições sem poder listá-las no Firestore.
const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || '';

export class WorkerApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function workerApi<T = any>(path: string, body?: unknown): Promise<T> {
  if (!WORKER_URL) throw new WorkerApiError('NEXT_PUBLIC_WORKER_URL não configurada.', 0);
  const res = await fetch(`${WORKER_URL}${path}`, body === undefined ? undefined : {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new WorkerApiError(data.error || `Erro ${res.status} no servidor.`, res.status);
  return data as T;
}

export const fetchTotalInscricoes = async () =>
  (await workerApi<{ total: number }>('/public/inscricoes/total')).total;

// Uploads do painel vão com o login do admin: sem ele o worker só aceita as
// imagens do site público (ver backend/worker/src/mediaUpload.js).
export async function adminAuthHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  return user ? { Authorization: `Bearer ${await user.getIdToken()}` } : {};
}

// Toda chamada do painel ao worker sai com o login do admin. O worker exige
// isso em todas as rotas fora da lista pública (PUBLIC_ROUTES no index.js); em
// vez de editar as ~40 chamadas fetch() do painel, o fetch global anexa o
// Authorization quando há admin logado e o destino é o worker. Atleta não tem
// sessão no Firebase Auth, então as chamadas dele seguem sem cabeçalho.
let workerAuthInstalled = false;

export function installWorkerAuth() {
  if (workerAuthInstalled || typeof window === 'undefined' || !WORKER_URL) return;
  workerAuthInstalled = true;
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const user = auth?.currentUser;
    if (!user || !url.startsWith(WORKER_URL)) return nativeFetch(input, init);
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
    if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
    return nativeFetch(input, { ...init, headers });
  };
}
