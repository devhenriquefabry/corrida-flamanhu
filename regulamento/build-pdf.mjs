// Gera regulamento-corrida-flamanhu-2027.pdf a partir de conteudo.mjs (HTML → Edge headless)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { EVENTO, INFO, AVISO_HORARIOS, SECOES, ASSINATURA } from './conteudo.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const HTML = path.join(dir, 'regulamento-corrida-flamanhu-2027.html');
const OUT = path.join(dir, 'regulamento-corrida-flamanhu-2027.pdf');
const LOGO = path.join(dir, '..', 'public', 'sistema', 'logo-corrida-flamanhu.png');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (t) =>
  esc(t)
    .replace(/\{\{(.*?)\}\}/g, '<mark>[$1]</mark>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

function table(it) {
  const cols = it.cols.map((p) => `<col style="width:${p}%">`).join('');
  const head = it.head.map((h) => `<th>${inline(h)}</th>`).join('');
  const rows = it.rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');
  return `<table class="dados"><colgroup>${cols}</colgroup><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}

function item(it) {
  switch (it.k) {
    case 'c': return `<p class="c"><b class="n">${it.n}</b><span>${inline(it.t)}</span></p>`;
    case 's': return `<p class="c s"><b class="n">${it.n}</b><span>${inline(it.t)}</span></p>`;
    case 'p': return `<p class="solto">${inline(it.t)}</p>`;
    case 'l': return `<ul>${it.items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>`;
    case 'table': return table(it);
    default: throw new Error(`item desconhecido: ${it.k}`);
  }
}

const hennder = `data:image/svg+xml;base64,${fs.readFileSync(path.join(dir, 'assets', 'hennder-company-light.svg')).toString('base64')}`;
const logo = `data:image/png;base64,${fs.readFileSync(LOGO).toString('base64')}`;

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Regulamento Oficial — Corrida Flamanhu 2027</title>
<style>
  @page {
    size: A4; margin: 20mm 20mm 24mm 20mm;
    @bottom-center {
      content: "${EVENTO.rodape}  ·  Página " counter(page) " de " counter(pages);
      font: 8pt Calibri, Arial, sans-serif; color: #666;
      border-top: 1.5pt solid #C8102E; padding-top: 3mm; width: 100%;
    }
  }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font: 11pt/1.4 Calibri, "Segoe UI", Arial, sans-serif; color: #1a1a1a; margin: 0; }
  header { text-align: center; }
  header img { width: 38mm; height: auto; }
  .tit { color: #C8102E; font-weight: 700; font-size: 13pt; letter-spacing: .15em; margin: 2mm 0 1mm; }
  h1.nome { font-size: 24pt; margin: 0 0 1mm; }
  .cid { font-size: 13pt; letter-spacing: .1em; margin: 0 0 6mm; }
  table.info { width: 100%; border-collapse: collapse; }
  table.info th { background: #1a1a1a; color: #fff; text-align: left; width: 35mm; padding: 2.2mm 3.5mm; border: .5pt solid #D8D0D0; font-size: 10.5pt; }
  table.info td { background: #F3F0F0; padding: 2.2mm 3.5mm; border: .5pt solid #D8D0D0; font-size: 10.5pt; }
  .aviso { text-align: center; font-style: italic; color: #666; font-size: 9.5pt; margin: 2.5mm 0 0; }
  h2 { font-size: 14pt; margin: 9mm 0 4mm; padding-bottom: 1.5mm; border-bottom: 2pt solid #C8102E; break-after: avoid; }
  h2 .num { color: #C8102E; }
  p.c { display: flex; margin: 0 0 2.2mm; break-inside: avoid; }
  p.c .n { flex: 0 0 12.7mm; color: #C8102E; }
  p.c.s { margin-left: 12.7mm; }
  p.c.s .n { flex-basis: 14.8mm; }
  p.solto { margin: 0 0 2.2mm 12.7mm; }
  ul { margin: 0 0 2.5mm 12.7mm; padding-left: 5mm; }
  ul li { margin-bottom: 1.2mm; }
  ul li::marker { color: #C8102E; }
  table.dados { width: calc(100% - 12.7mm); margin: 1mm 0 4mm 12.7mm; border-collapse: collapse; break-inside: avoid; }
  table.dados th { background: #C8102E; color: #fff; text-align: left; padding: 1.8mm 3mm; border: .5pt solid #D8D0D0; font-size: 10.5pt; }
  table.dados td { padding: 1.8mm 3mm; border: .5pt solid #D8D0D0; font-size: 10.5pt; }
  table.dados tbody tr:nth-child(even) td { background: #F3F0F0; }
  table.dados td:first-child { font-weight: 700; }
  mark { background: #fff200; color: inherit; padding: 0 .5mm; }
  .assinatura { text-align: center; margin-top: 12mm; break-inside: avoid; }
  .assinatura img.hennder { width: 62mm; height: auto; margin: 2mm 0 3mm; }
  .assinatura p { margin: 0 0 1mm; font-weight: 700; }
  .assinatura .nota { font-weight: 400; font-style: italic; color: #666; font-size: 10pt; margin-top: 4mm; }
</style></head>
<body>
<header>
  <img src="${logo}" alt="Corrida Flamanhu 2027">
  <div class="tit">${esc(EVENTO.titulo)}</div>
  <h1 class="nome">${esc(EVENTO.nome)}</h1>
  <div class="cid">${esc(EVENTO.cidade)}</div>
</header>
<table class="info">${INFO.map(([l, v]) => `<tr><th>${esc(l)}</th><td>${inline(v)}</td></tr>`).join('')}</table>
<p class="aviso">${esc(AVISO_HORARIOS)}</p>
${SECOES.map((s) => `<section><h2><span class="num">${s.num} —</span> ${esc(s.titulo)}</h2>${s.itens.map(item).join('\n')}</section>`).join('\n')}
<div class="assinatura">
  <p style="font-weight:400">${esc(ASSINATURA.local)}</p>
  <img class="hennder" src="${hennder}" alt="Hennder Company">
  ${ASSINATURA.linhas.map((l) => `<p>${inline(l)}</p>`).join('')}
  <p class="nota">${esc(ASSINATURA.nota)}</p>
</div>
</body></html>`;

fs.writeFileSync(HTML, html);

const browsers = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
];
const exe = browsers.find((b) => fs.existsSync(b));
if (!exe) throw new Error('Edge/Chrome não encontrado');

if (fs.existsSync(OUT)) fs.unlinkSync(OUT);
execFileSync(exe, [
  '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
  `--print-to-pdf=${OUT}`, pathToFileURL(HTML).href,
], { stdio: 'ignore', timeout: 60000 });

fs.unlinkSync(HTML);
console.log('ok →', OUT, fs.statSync(OUT).size, 'bytes');
