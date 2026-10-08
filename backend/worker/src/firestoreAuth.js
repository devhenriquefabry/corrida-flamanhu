// Acesso de servidor ao Firestore: as chamadas REST do worker saem autenticadas
// com a conta de serviço do Firebase (secret FIREBASE_SERVICE_ACCOUNT = o JSON
// baixado em Configurações do projeto > Contas de serviço). Conta de serviço
// ignora as regras do Firestore, então o worker continua lendo e gravando
// inscrições mesmo com o banco fechado para o público.
//
// O worker faz ~25 fetch() para firestore.googleapis.com espalhados pelo
// index.js; em vez de mexer em cada um, o fetch global passa a anexar o
// Authorization quando o destino é o Firestore.

const FIRESTORE_ORIGIN = "https://firestore.googleapis.com/";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/datastore";

const nativeFetch = globalThis.fetch.bind(globalThis);

let serviceAccountJson = "";
let cachedToken = null; // { value, expiresAt } — vale 1h, reaproveitado entre requisições do isolate
let pendingToken = null;

// Chamado no início de cada fetch/scheduled com o env do worker.
export function useFirestoreServiceAccount(env) {
  const json = String(env.FIREBASE_SERVICE_ACCOUNT || "");
  if (json !== serviceAccountJson) {
    serviceAccountJson = json;
    cachedToken = null;
  }
}

export function hasFirestoreServiceAccount() {
  return Boolean(serviceAccountJson);
}

const base64url = (bytes) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const base64urlJson = (value) => base64url(new TextEncoder().encode(JSON.stringify(value)));

function pemToPkcs8(pem) {
  const body = String(pem).replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  return Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
}

async function requestAccessToken() {
  const account = JSON.parse(serviceAccountJson);
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${base64urlJson({ alg: "RS256", typ: "JWT" })}.${base64urlJson({
    iss: account.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToPkcs8(account.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned))
  );

  const res = await nativeFetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${base64url(signature)}`,
    }),
  });
  if (!res.ok) {
    throw new Error(`Google recusou a conta de serviço (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  cachedToken = { value: data.access_token, expiresAt: now + Number(data.expires_in || 3600) };
  return cachedToken.value;
}

export async function getFirestoreAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt - 120 > now) return cachedToken.value;
  // várias chamadas simultâneas na virada do token pedem um só
  pendingToken ||= requestAccessToken().finally(() => { pendingToken = null; });
  return pendingToken;
}

globalThis.fetch = async function fetchWithFirestoreAuth(input, init) {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (!serviceAccountJson || !url.startsWith(FIRESTORE_ORIGIN)) return nativeFetch(input, init);

  const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
  headers.set("Authorization", `Bearer ${await getFirestoreAccessToken()}`);
  return nativeFetch(input, { ...init, headers });
};
