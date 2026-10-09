// Confere se a requisição vem de um administrador logado no painel: o site
// manda o ID token do Firebase Auth (Authorization: Bearer ...), o worker
// valida a assinatura com as chaves públicas do Google e procura o e-mail em
// nightrun_admins (mesma regra de isAdmin() do firestore.rules).

const JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

let jwksCache = { keys: null, expiresAt: 0 };

async function getSigningKeys() {
  if (jwksCache.keys && Date.now() < jwksCache.expiresAt) return jwksCache.keys;
  const res = await fetch(JWKS_URL);
  if (!res.ok) throw new Error(`Chaves do Firebase indisponíveis (${res.status})`);
  const maxAge = Number(/max-age=(\d+)/.exec(res.headers.get("Cache-Control") || "")?.[1] || 3600);
  jwksCache = { keys: (await res.json()).keys || [], expiresAt: Date.now() + maxAge * 1000 };
  return jwksCache.keys;
}

const decodePart = (part) =>
  JSON.parse(new TextDecoder().decode(
    Uint8Array.from(atob(part.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))
  ));

const decodeSignature = (part) =>
  Uint8Array.from(atob(part.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

// Devolve o payload do token se for válido para este projeto; senão, null.
export async function verifyFirebaseIdToken(token, projectId) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3 || !projectId) return null;
  try {
    const header = decodePart(parts[0]);
    const payload = decodePart(parts[1]);
    if (header.alg !== "RS256") return null;

    const jwk = (await getSigningKeys()).find((key) => key.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey(
      "jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]
    );
    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5", key, decodeSignature(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    );
    if (!valid) return null;

    const now = Math.floor(Date.now() / 1000);
    if (payload.aud !== projectId) return null;
    if (payload.iss !== `https://securetoken.google.com/${projectId}`) return null;
    if (!payload.sub || payload.exp <= now || payload.iat > now + 300) return null;
    return payload;
  } catch {
    return null;
  }
}

// E-mail do admin autenticado, ou null. isAdminEmail recebe o e-mail e diz se
// ele está em nightrun_admins (consulta feita com a conta de serviço).
export async function getAdminEmail(request, env, isAdminEmail) {
  const match = /^Bearer\s+(.+)$/i.exec(request.headers.get("Authorization") || "");
  if (!match) return null;
  const payload = await verifyFirebaseIdToken(match[1], env.FIREBASE_PROJECT_ID);
  const email = String(payload?.email || "").toLowerCase();
  if (!email) return null;
  return (await isAdminEmail(email)) ? email : null;
}
