import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const regulamento = await readFile(new URL('../src/content/regulamentoOficial.ts', import.meta.url), 'utf8');
const publicForm = await readFile(new URL('../src/pages/PublicForm.tsx', import.meta.url), 'utf8');

test('official regulation contains current event data and public rules', () => {
  assert.match(regulamento, /CORRIDA FLAMANHU 2027 — MANHUAÇU\/MG/);
  assert.match(regulamento, /Data: 15\/05\/2027/);
  assert.match(regulamento, /Praça Cordovil Pinto Coelho/);
  assert.match(regulamento, /Largadas 3,0km \(caminhada\), 5km e 10km: 09h/);
  assert.match(regulamento, /Hennder Company é a organizadora do evento/);
  assert.match(regulamento, /FlaManhu é parceira do evento/);
  assert.match(regulamento, /não possui vínculo, patrocínio, apoio ou chancela oficial do Clube de Regatas do Flamengo/i);
  assert.match(regulamento, /não possui categoria por local de residência/);
});

test('official regulation no longer carries the MCU Night Run references', () => {
  assert.doesNotMatch(regulamento, /MCU|MÇU|Mçu|ADEMARE|Prefeitura|Estádio JK/);
  assert.doesNotMatch(regulamento, /Morador de Manhuaçu/);
  assert.match(regulamento, /regulamento-corrida-flamanhu-2027\.pdf/);
});

test('public form keeps the official regulation hidden from the terms modal', () => {
  assert.doesNotMatch(publicForm, /REGULAMENTO_OFICIAL/);
  assert.doesNotMatch(publicForm, /terms-regulation-text/);
});
