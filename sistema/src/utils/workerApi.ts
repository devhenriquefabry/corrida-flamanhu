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
