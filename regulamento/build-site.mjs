// Gera sistema/src/content/regulamentoOficial.ts (texto exibido no site e no modal de assinatura)
// e copia o PDF para public/sistema/. Rode depois de build-pdf.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EVENTO, INFO, AVISO_HORARIOS, SECOES, ASSINATURA } from './conteudo.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(dir, '..');
const PDF_NOME = 'regulamento-corrida-flamanhu-2027.pdf';
const TS = path.join(ROOT, 'sistema', 'src', 'content', 'regulamentoOficial.ts');

// {{pendência}} fica visível entre colchetes; **negrito** perde a marcação
const plain = (t) => t.replace(/\{\{(.*?)\}\}/g, '[$1]').replace(/\*\*(.*?)\*\*/g, '$1');

function tabela(it) {
  return it.rows.map((r) => {
    if (it.cols.length === 2) return `${plain(r[0])}${it.head[0] === 'Horário' ? ' — ' : ': '}${plain(r[1])}`;
    const [first, ...rest] = r;
    return `${plain(first)} — ${rest.map((c, i) => `${it.head[i + 1]}: ${plain(c)}`).join(' | ')}`;
  }).join('\n');
}

function item(it) {
  switch (it.k) {
    case 'c': return `${it.n} — ${plain(it.t)}`;
    case 's': return `${it.n} — ${plain(it.t)}`;
    case 'p': return plain(it.t);
    case 'l': return it.items.map((t) => `• ${plain(t)}`).join('\n');
    case 'table': return tabela(it);
    default: throw new Error(`item desconhecido: ${it.k}`);
  }
}

const blocos = [
  EVENTO.titulo,
  `${EVENTO.nome} — ${EVENTO.cidade}`,
  [
    ...INFO.map(([l, v]) => `${l}: ${plain(v)}`),
    AVISO_HORARIOS,
  ].join('\n'),
  ...SECOES.map((s) => [`${s.num} — ${s.titulo}`, ...s.itens.map(item)].join('\n')),
  [ASSINATURA.local, ...ASSINATURA.linhas.map(plain), ASSINATURA.nota].join('\n'),
];

const texto = blocos.join('\n\n');
// String.raw não processa escapes: o texto não pode conter crase, ${ nem barra invertida
if (/[`\\]|\$\{/.test(texto)) throw new Error('texto contém crase, ${ ou barra invertida');

fs.writeFileSync(TS, `import { withBase } from '../utils/withBase';
export const REGULAMENTO_PDF_URL = withBase('/sistema/${PDF_NOME}');

export const REGULAMENTO_OFICIAL = String.raw\`${texto}\`;
`);

fs.copyFileSync(path.join(dir, PDF_NOME), path.join(ROOT, 'public', 'sistema', PDF_NOME));
console.log('ok →', TS);
