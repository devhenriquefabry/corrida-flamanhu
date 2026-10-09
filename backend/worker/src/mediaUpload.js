// Upload de arquivos para o R2 (MEDIA_BUCKET).
//
// Sem login: só as pastas que o site público usa (foto do atleta, card #EUVOU,
// imagem do ganhador), só imagem, até 8 MB, com limite de envios por IP.
// Admin logado (ver adminAuth.js): qualquer pasta, também PDF e vídeo, até 25 MB.
//
// O tipo é descoberto pelos primeiros bytes do arquivo, nunca pelo que o
// navegador declara — senão daria para subir um HTML e servi-lo deste domínio.
import { getAdminEmail } from "./adminAuth.js";
import { isAdminEmail, tooManyAttempts } from "./publicApi.js";

const PUBLIC_FOLDERS = new Set(["nightrun_photos", "nightrun_cards", "nightrun_winners"]);
const PUBLIC_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ADMIN_TYPES = new Set([...PUBLIC_TYPES, "image/gif", "application/pdf", "video/mp4", "video/quicktime", "video/webm"]);
const PUBLIC_MAX_BYTES = 8 * 1024 * 1024;
const ADMIN_MAX_BYTES = 25 * 1024 * 1024;
const PUBLIC_UPLOADS_PER_15_MIN = 30;

const EXTENSIONS = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif",
  "application/pdf": "pdf", "video/mp4": "mp4", "video/quicktime": "mov", "video/webm": "webm",
};

const startsWith = (bytes, signature, offset = 0) =>
  signature.every((byte, i) => bytes[offset + i] === byte);

const ascii = (text) => [...text].map((c) => c.charCodeAt(0));

export function sniffContentType(buffer) {
  const bytes = new Uint8Array(buffer.slice(0, 16));
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (startsWith(bytes, ascii("RIFF")) && startsWith(bytes, ascii("WEBP"), 8)) return "image/webp";
  if (startsWith(bytes, ascii("GIF8"))) return "image/gif";
  if (startsWith(bytes, ascii("%PDF-"))) return "application/pdf";
  if (startsWith(bytes, [0x1a, 0x45, 0xdf, 0xa3])) return "video/webm";
  if (startsWith(bytes, ascii("ftyp"), 4)) return startsWith(bytes, ascii("qt  "), 8) ? "video/quicktime" : "video/mp4";
  return null;
}

export async function handleMediaUpload(request, env, url, json) {
  if (!env.MEDIA_BUCKET) return json({ error: "Armazenamento de mídia não configurado." }, 503);

  const contentType = request.headers.get("Content-Type") || "";
  let fileData;
  let fileName;
  let folder;
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") return json({ error: "Nenhum arquivo enviado." }, 400);
    fileData = await file.arrayBuffer();
    fileName = file.name || "";
    folder = String(formData.get("folder") || "uploads");
  } else {
    fileData = await request.arrayBuffer();
    fileName = url.searchParams.get("name") || "";
    folder = url.searchParams.get("folder") || "uploads";
  }
  folder = folder.replace(/[^a-zA-Z0-9_-]/g, "_");

  const adminEmail = await getAdminEmail(request, env, (email) => isAdminEmail(env, email));

  if (!adminEmail) {
    if (!PUBLIC_FOLDERS.has(folder)) return json({ error: "Envio não permitido nesta pasta." }, 403);
    const ip = request.headers.get("CF-Connecting-IP") || "sem-ip";
    if (await tooManyAttempts(env, `upload:ip:${ip}`, PUBLIC_UPLOADS_PER_15_MIN)) {
      return json({ error: "Muitos envios em sequência. Aguarde alguns minutos." }, 429);
    }
  }

  const maxBytes = adminEmail ? ADMIN_MAX_BYTES : PUBLIC_MAX_BYTES;
  if (fileData.byteLength === 0) return json({ error: "Arquivo vazio." }, 400);
  if (fileData.byteLength > maxBytes) {
    return json({ error: `Arquivo muito grande. Envie até ${Math.round(maxBytes / 1024 / 1024)} MB.` }, 413);
  }

  const mimeType = sniffContentType(fileData);
  const allowed = adminEmail ? ADMIN_TYPES : PUBLIC_TYPES;
  if (!mimeType || !allowed.has(mimeType)) {
    return json({
      error: adminEmail
        ? "Formato não aceito. Envie imagem (JPG, PNG, WebP, GIF), PDF ou vídeo (MP4, MOV, WebM)."
        : "Formato não aceito. Envie uma imagem JPG, PNG ou WebP.",
    }, 415);
  }

  // nome seguro com a extensão do tipo real
  const baseName = fileName.replace(/\.[^.]*$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60) || crypto.randomUUID();
  const key = `${folder}/${Date.now()}_${baseName}.${EXTENSIONS[mimeType]}`;
  await env.MEDIA_BUCKET.put(key, fileData, { httpMetadata: { contentType: mimeType } });
  return json({ url: `${url.origin}/media/${key}`, key });
}
