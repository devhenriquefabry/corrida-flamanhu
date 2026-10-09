import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleMediaUpload, sniffContentType } from '../src/mediaUpload.js';

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1]);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0x0d]);
const PDF = new TextEncoder().encode('%PDF-1.7\n...');
const HTML = new TextEncoder().encode('<html><script>alert(1)</script></html>');

const json = (data, status = 200) => new Response(JSON.stringify(data), { status });

function fakeEnv() {
  const stored = new Map();
  const kv = new Map();
  return {
    stored,
    MEDIA_BUCKET: { put: async (key, data, opts) => stored.set(key, { size: data.byteLength, type: opts.httpMetadata.contentType }) },
    NIGHTRUN_STORAGE: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => kv.set(k, v) },
  };
}

async function upload(env, bytes, { folder = 'nightrun_photos', declaredType = 'image/jpeg', headers = {} } = {}) {
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: declaredType }), 'foto.jpg');
  form.append('folder', folder);
  const url = new URL('https://worker.test/media/upload');
  const request = new Request(url, { method: 'POST', body: form, headers: { 'CF-Connecting-IP': '1.2.3.4', ...headers } });
  const res = await handleMediaUpload(request, env, url, json);
  return { status: res.status, body: await res.json() };
}

test('identifica o tipo pelos bytes, não pelo nome', () => {
  assert.equal(sniffContentType(JPEG.buffer), 'image/jpeg');
  assert.equal(sniffContentType(PNG.buffer), 'image/png');
  assert.equal(sniffContentType(PDF.buffer), 'application/pdf');
  assert.equal(sniffContentType(HTML.buffer), null);
});

test('público envia foto JPEG para a pasta de fotos', async () => {
  const env = fakeEnv();
  const { status, body } = await upload(env, JPEG);
  assert.equal(status, 200);
  assert.match(body.key, /^nightrun_photos\/\d+_foto\.jpg$/);
  assert.equal([...env.stored.values()][0].type, 'image/jpeg');
});

test('HTML disfarçado de imagem é recusado', async () => {
  const { status } = await upload(fakeEnv(), HTML, { declaredType: 'image/png' });
  assert.equal(status, 415);
});

test('público não envia PDF', async () => {
  const { status } = await upload(fakeEnv(), PDF, { declaredType: 'application/pdf' });
  assert.equal(status, 415);
});

test('público não envia para pastas do admin', async () => {
  const { status } = await upload(fakeEnv(), JPEG, { folder: 'bank_receipts' });
  assert.equal(status, 403);
});

test('público tem limite de 8 MB', async () => {
  const big = new Uint8Array(8 * 1024 * 1024 + 1);
  big.set(JPEG);
  const { status } = await upload(fakeEnv(), big);
  assert.equal(status, 413);
});

test('público tem limite de envios por IP', async () => {
  const env = fakeEnv();
  for (let i = 0; i < 30; i++) assert.equal((await upload(env, JPEG)).status, 200);
  assert.equal((await upload(env, JPEG)).status, 429);
});

test('token de admin inválido não libera nada', async () => {
  const { status } = await upload(fakeEnv(), PDF, { folder: 'bank_receipts', headers: { Authorization: 'Bearer falso' } });
  assert.equal(status, 403);
});
