// Gera as artes rasterizadas do sistema de inscrições na identidade da
// Corrida Flamanhu (carvão + rubro + branco-giz, bandeira rubro-negra).
//
//   node sistema/arte/gerar-artes.mjs
//
// Saída em public/sistema/. Rode de novo quando mudar a data/local do evento
// em sistema/src/config/evento.ts — o card #EUVOU e o cabeçalho dos PDFs
// trazem esses dados impressos.
//
// Fontes: Anton (public/sistema/fonts, a mesma do site) nos títulos e
// Bahnschrift (vem com o Windows) nos textos de apoio. O sharp renderiza o SVG
// pelo librsvg/fontconfig; apontamos o fontconfig para essas pastas antes de
// carregar o sharp.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SAIDA = path.join(RAIZ, 'public/sistema');

// No Windows a lib nativa lê o ambiente da cópia feita na subida do processo:
// mudar process.env aqui não chega nela. Então montamos o fonts.conf e
// reexecutamos o script com FONTCONFIG_FILE já definido.
if (!process.env.FLAMANHU_FC) {
  const fcDir = fs.mkdtempSync(path.join(os.tmpdir(), 'flamanhu-fc-'));
  const fontDirs = [path.join(RAIZ, 'public/sistema/fonts')];
  if (process.platform === 'win32') fontDirs.push('C:/Windows/Fonts');
  fs.writeFileSync(path.join(fcDir, 'fonts.conf'), `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
${fontDirs.map((d) => `  <dir>${d.replace(/\\/g, '/')}</dir>`).join('\n')}
  <cachedir>${path.join(fcDir, 'cache').replace(/\\/g, '/')}</cachedir>
</fontconfig>`);
  const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, FLAMANHU_FC: '1', FONTCONFIG_FILE: path.join(fcDir, 'fonts.conf') },
  });
  fs.rmSync(fcDir, { recursive: true, force: true });
  process.exit(r.status ?? 1);
}
const { default: sharp } = await import('sharp');

// ---------------------------------------------------------------- dados
const eventoTs = fs.readFileSync(path.join(RAIZ, 'sistema/src/config/evento.ts'), 'utf8');
const campo = (nome) => (eventoTs.match(new RegExp(`${nome}:\\s*'([^']*)'`)) || [])[1] || '';
const EVENTO = {
  nome: campo('nome'),
  data: campo('data'),
  largada: campo('horarioLargada'),
  instagram: '@' + (campo('instagramUrl').split('/').filter(Boolean).pop() || 'corrida_flamanhu'),
};

const C = {
  carvao: '#0b0a0a', carvao2: '#141112', carvao3: '#1c1718',
  rubro: '#e01b22', vivo: '#ff2e38', sangue: '#7a0c12', sangueEsc: '#3d060a',
  giz: '#f4efea', fumaca: '#a79f9b', listraPreta: '#151011',
};
const DISPLAY = "font-family=\"Anton\"";
const APOIO = "font-family=\"Bahnschrift, Arial Narrow, Arial\" font-weight=\"700\" font-stretch=\"condensed\"";

const logoB64 = fs.readFileSync(path.join(RAIZ, 'sistema/arte/logo-corrida-flamanhu-master.png')).toString('base64');
const LOGO_RATIO = 1205 / 1101;
const logo = (x, y, w, extra = '') =>
  `<image x="${x}" y="${y}" width="${w}" height="${(w / LOGO_RATIO).toFixed(1)}" href="data:image/png;base64,${logoB64}" ${extra}/>`;

// gerador pseudo-aleatório determinístico (as artes saem iguais a cada rodada)
const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------------------------------------------------------------- peças
// Bandeira rubro-negra ondulando: faixas com bordas senoidais + sombreamento de dobra.
function bandeira({ id, x, y, w, h, faixas = 8, ang = -16, amp = 22, ondas = 1.6, opacidade = 1, fade = 'right' }) {
  const banda = h / faixas;
  const passos = 48;
  const k = (Math.PI * 2 * ondas) / w;
  const borda = (yy, i) => Array.from({ length: passos + 1 }, (_, s) => {
    const xx = (w * s) / passos;
    const amort = 0.35 + 0.65 * (xx / w); // tremula mais na ponta solta
    return [xx, yy + amp * amort * Math.sin(k * xx + i * 0.15)];
  });
  let faixasSvg = '';
  for (let i = 0; i < faixas; i++) {
    const topo = borda(i * banda, i);
    const base = borda((i + 1) * banda, i + 1).reverse();
    const d = 'M' + [...topo, ...base].map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join('L') + 'Z';
    faixasSvg += `<path d="${d}" fill="${i % 2 ? C.listraPreta : C.rubro}"/>`;
  }
  // dobras: gradiente horizontal claro/escuro acompanhando a onda
  const stops = Array.from({ length: 25 }, (_, s) => {
    const t = s / 24;
    const v = Math.sin(k * w * t - 0.9);
    const cor = v > 0 ? '#ffffff' : '#000000';
    return `<stop offset="${t}" stop-color="${cor}" stop-opacity="${(Math.abs(v) * (v > 0 ? 0.16 : 0.42)).toFixed(3)}"/>`;
  }).join('');
  const fadeGrad = {
    right: `x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.35" stop-color="#fff" stop-opacity="1"/>`,
    left: `x1="0" y1="0" x2="1" y2="0"><stop offset="0.65" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>`,
    both: `x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.3" stop-color="#fff" stop-opacity="1"/><stop offset="0.7" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>`,
    none: `x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/>`,
  }[fade];
  return `
  <defs>
    <linearGradient id="${id}-dobra" x1="0" y1="0" x2="1" y2="0">${stops}</linearGradient>
    <linearGradient id="${id}-fadeg" ${fadeGrad}</linearGradient>
    <mask id="${id}-mask" maskContentUnits="userSpaceOnUse">
      <rect x="${-amp}" y="${-amp * 2}" width="${w + amp * 2}" height="${h + amp * 4}" fill="url(#${id}-fadeg)"/>
    </mask>
  </defs>
  <g transform="translate(${x} ${y}) rotate(${ang} ${w / 2} ${h / 2})" opacity="${opacidade}">
    <g mask="url(#${id}-mask)">
      ${faixasSvg}
      <rect x="0" y="${-amp}" width="${w}" height="${h + amp * 2}" fill="url(#${id}-dobra)"/>
    </g>
  </g>`;
}

// Linhas de velocidade: paralelogramos finos inclinados (o "chanfro" do site).
function velocidade({ seed, n, x, y, w, h, cor = C.giz, op = 0.08 }) {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const yy = y + r() * h;
    const len = w * (0.25 + r() * 0.6);
    const xx = x + r() * (w - len);
    const esp = 2 + r() * 5;
    out += `<polygon points="${xx},${yy} ${xx + len},${yy} ${xx + len - esp * 3},${yy + esp} ${xx - esp * 3},${yy + esp}" fill="${cor}" opacity="${(op * (0.4 + r())).toFixed(3)}"/>`;
  }
  return out;
}

function confete({ seed, n, w, h, area }) {
  const r = rng(seed);
  const cores = [C.rubro, C.vivo, C.giz, C.giz, C.sangue];
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = r() * w;
    const y = area ? area[0] + r() * (area[1] - area[0]) : r() * h;
    const cw = 6 + r() * 14;
    const ch = 3 + r() * 6;
    out += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${cw.toFixed(0)}" height="${ch.toFixed(0)}" fill="${cores[i % cores.length]}" opacity="${(0.35 + r() * 0.6).toFixed(2)}" transform="rotate(${(r() * 360).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
  }
  return out;
}

// Fundo base: carvão, brasa vermelha num canto, vinheta e granulação.
function base(w, h, { brasa = [0.85, 0.12], raio = 0.75 } = {}) {
  return `
  <defs>
    <radialGradient id="brasa" cx="${brasa[0]}" cy="${brasa[1]}" r="${raio}">
      <stop offset="0" stop-color="${C.sangue}" stop-opacity="0.85"/>
      <stop offset="0.45" stop-color="${C.sangueEsc}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${C.carvao}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vinheta" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.65"/>
    </radialGradient>
    <filter id="grao" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.07"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="${C.carvao}"/>
  <rect width="${w}" height="${h}" fill="url(#brasa)"/>`;
}
const acabamento = (w, h) => `
  <rect width="${w}" height="${h}" fill="url(#vinheta)"/>
  <rect width="${w}" height="${h}" filter="url(#grao)"/>`;

const svg = (w, h, corpo) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${corpo}</svg>`;

// ---------------------------------------------------------------- artes
function fundoRetrato(w, h, seed) {
  return svg(w, h, `
    ${base(w, h, { brasa: [0.9, 0.08], raio: 0.8 })}
    ${bandeira({ id: 'b1', x: -w * 0.15, y: h * 0.02, w: w * 1.5, h: h * 0.3, faixas: 7, ang: -24, amp: 26, fade: 'right', opacidade: 0.9 })}
    ${velocidade({ seed, n: 16, x: 0, y: h * 0.45, w, h: h * 0.5 })}
    <rect y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="${C.carvao}" opacity="0.35"/>
    ${acabamento(w, h)}`);
}

function fundoPremio(w, h) {
  return svg(w, h, `
    ${base(w, h, { brasa: [0.5, 0.42], raio: 0.7 })}
    ${bandeira({ id: 'b1', x: -w * 0.35, y: -h * 0.04, w: w * 1.7, h: h * 0.24, faixas: 7, ang: -20, amp: 22, fade: 'both', opacidade: 0.75 })}
    ${bandeira({ id: 'b2', x: -w * 0.3, y: h * 0.84, w: w * 1.6, h: h * 0.2, faixas: 6, ang: -14, amp: 18, fade: 'both', opacidade: 0.55 })}
    ${confete({ seed: 11, n: 90, w, h })}
    ${velocidade({ seed: 5, n: 10, x: 0, y: h * 0.3, w, h: h * 0.4, op: 0.06 })}
    ${acabamento(w, h)}`);
}

function fundoCardAtleta(w, h) {
  return svg(w, h, `
    ${base(w, h, { brasa: [0.82, 0.3], raio: 0.7 })}
    ${bandeira({ id: 'b1', x: w * 0.38, y: -h * 0.25, w: w * 0.85, h: h * 1.25, faixas: 9, ang: -14, amp: 34, fade: 'right', opacidade: 0.85 })}
    ${velocidade({ seed: 3, n: 14, x: 0, y: h * 0.1, w: w * 0.6, h: h * 0.8 })}
    <defs><linearGradient id="esq" x1="0" x2="1"><stop offset="0" stop-color="${C.carvao}" stop-opacity="0.92"/><stop offset="0.55" stop-color="${C.carvao}" stop-opacity="0.35"/><stop offset="1" stop-color="${C.carvao}" stop-opacity="0"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#esq)"/>
    ${acabamento(w, h)}`);
}

function cabecalhoPdf(w, h) {
  const lw = h * 0.86 * LOGO_RATIO;
  const tx = 60 + lw + 50;
  const [dia, mes, ano] = EVENTO.data.split('/');
  const meses = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  const dataExt = dia ? `${Number(dia)} DE ${meses[Number(mes) - 1]} DE ${ano}` : '';
  return svg(w, h, `
    ${base(w, h, { brasa: [0.95, 0.5], raio: 0.6 })}
    ${bandeira({ id: 'b1', x: w * 0.7, y: -h * 0.35, w: w * 0.45, h: h * 1.7, faixas: 9, ang: -18, amp: 26, fade: 'right', opacidade: 0.9 })}
    <defs><linearGradient id="esq" x1="0" x2="1"><stop offset="0.62" stop-color="${C.carvao}" stop-opacity="0.97"/><stop offset="0.9" stop-color="${C.carvao}" stop-opacity="0"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#esq)"/>
    ${logo(60, h * 0.07, lw)}
    <text ${DISPLAY} font-size="${h * 0.25}" fill="${C.giz}" transform="translate(${tx} ${h * 0.42}) skewX(-6)">CORRIDA <tspan fill="${C.rubro}">FLAMANHU</tspan></text>
    <polygon points="${tx},${h * 0.5} ${tx + 520},${h * 0.5} ${tx + 512},${h * 0.52} ${tx - 8},${h * 0.52}" fill="${C.rubro}"/>
    <text x="${tx}" y="${h * 0.64}" ${APOIO} font-size="${h * 0.075}" fill="${C.fumaca}" letter-spacing="6">${esc(dataExt)}${EVENTO.largada ? ` · LARGADA ${esc(EVENTO.largada.toUpperCase())}` : ''}</text>
    <text x="${tx}" y="${h * 0.77}" ${APOIO} font-size="${h * 0.075}" fill="${C.fumaca}" letter-spacing="6">MANHUAÇU · MG  ·  5K · 10K · CAMINHADA</text>
    <rect y="${h - 10}" width="${w}" height="10" fill="${C.rubro}"/>
    ${acabamento(w, h)}`);
}

function transicaoPdf(w, h) {
  const lw = h * 0.62 * LOGO_RATIO;
  return svg(w, h, `
    ${base(w, h, { brasa: [0.78, 0.45], raio: 0.6 })}
    ${bandeira({ id: 'b1', x: w * 0.45, y: -h * 0.2, w: w * 0.75, h: h * 1.4, faixas: 10, ang: -16, amp: 30, fade: 'right', opacidade: 0.8 })}
    <defs><linearGradient id="esq" x1="0" x2="1"><stop offset="0.35" stop-color="${C.carvao}" stop-opacity="0.96"/><stop offset="0.62" stop-color="${C.carvao}" stop-opacity="0.2"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#esq)"/>
    ${velocidade({ seed: 9, n: 12, x: 0, y: h * 0.1, w: w * 0.5, h: h * 0.8, op: 0.05 })}
    ${logo(w * 0.74 - lw / 2, h * 0.5 - lw / LOGO_RATIO / 2, lw, 'opacity="0.96"')}
    ${acabamento(w, h)}`);
}

// Card #EUVOU — a foto e a modalidade são desenhadas por cima no navegador
// (PublicForm.generateEuVouCard / AdminAtletaDetalhes). As posições abaixo
// seguem a caixa definida lá: centro (0.6738, 0.4429), 0.4955 x 0.4265, 4.35°.
// Modalidade escrita em (0.095, 0.412) — a coluna esquerda fica livre ali.
function cardEuVou(w, h, kids) {
  const box = { cx: w * 0.6738, cy: h * 0.4429, bw: w * 0.4955, bh: h * 0.4265 };
  const lw = w * 0.36;
  const ly = 34;
  const lh = lw / LOGO_RATIO;
  const [dia, mes, ano] = EVENTO.data.split('/');
  return svg(w, h, `
    ${base(w, h, { brasa: [0.75, 0.3], raio: 0.75 })}
    ${bandeira({ id: 'b1', x: w * 0.25, y: -h * 0.06, w: w * 1.0, h: h * 0.42, faixas: 8, ang: -14, amp: 28, fade: 'right', opacidade: 0.9 })}
    ${velocidade({ seed: 21, n: 14, x: 0, y: h * 0.66, w, h: h * 0.2, op: 0.07 })}
    <!-- lâmina vermelha atrás da foto -->
    <g transform="translate(${box.cx + 26} ${box.cy + 30}) rotate(-2.5)">
      <rect x="${-box.bw / 2}" y="${-box.bh / 2}" width="${box.bw}" height="${box.bh}" fill="${C.rubro}"/>
    </g>
    <g transform="translate(${box.cx} ${box.cy}) rotate(4.35)">
      <rect x="${-box.bw / 2}" y="${-box.bh / 2}" width="${box.bw}" height="${box.bh}" fill="${C.carvao3}"/>
    </g>
    ${logo(30, ly, lw)}
    <!-- data -->
    <text ${DISPLAY} font-size="74" fill="${C.giz}" transform="translate(48 ${ly + lh + 74}) skewX(-6)">${dia}.${mes}<tspan fill="${C.rubro}">.</tspan>${ano}</text>
    <text x="50" y="${ly + lh + 112}" ${APOIO} font-size="25" fill="${C.fumaca}" letter-spacing="3">${EVENTO.largada ? `LARGADA ${esc(EVENTO.largada.toUpperCase())} · ` : ''}MANHUAÇU-MG</text>
    ${kids ? `<g transform="translate(50 ${h * 0.412 - 52}) skewX(-6)"><rect width="180" height="40" fill="${C.giz}"/><text x="90" y="30" text-anchor="middle" ${DISPLAY} font-size="30" fill="${C.rubro}" letter-spacing="2">CORRIDA KIDS</text></g>` : ''}
    <!-- slogan na coluna esquerda, abaixo da modalidade -->
    <rect x="50" y="${h * 0.505}" width="8" height="150" fill="${C.rubro}"/>
    <text ${APOIO} font-size="38" fill="${C.giz}" letter-spacing="1">
      <tspan x="74" y="${h * 0.505 + 36}">A NAÇÃO</tspan>
      <tspan x="74" y="${h * 0.505 + 84}" fill="${C.vivo}">RUBRO-NEGRA</tspan>
      <tspan x="74" y="${h * 0.505 + 132}">CORRE UNIDA</tspan>
    </text>
    <!-- #EUVOU -->
    <text ${DISPLAY} font-size="${w * 0.2}" fill="${C.giz}" transform="translate(${w * 0.05} ${h * 0.835}) skewX(-6)">#EU VOU</text>
    <text ${DISPLAY} font-size="${w * 0.1}" fill="${C.rubro}" transform="translate(${w * 0.55} ${h * 0.905}) skewX(-6)">E VOCÊ?</text>
    <!-- rodapé -->
    <polygon points="0,${h - 74} ${w},${h - 74} ${w},${h} 0,${h}" fill="${C.rubro}"/>
    <text x="40" y="${h - 26}" ${APOIO} font-size="30" fill="#fff" letter-spacing="4">${esc(EVENTO.nome.toUpperCase())} · 5K · 10K · CAMINHADA</text>
    <text x="${w - 40}" y="${h - 26}" text-anchor="end" ${APOIO} font-size="30" fill="#fff" letter-spacing="2">${esc(EVENTO.instagram)}</text>
    ${acabamento(w, h)}`);
}

function kitEmBreve(w, h) {
  const lw = w * 0.78;
  return svg(w, h, `
    ${base(w, h, { brasa: [0.5, 0.35], raio: 0.7 })}
    ${bandeira({ id: 'b1', x: -w * 0.3, y: h * 0.62, w: w * 1.6, h: h * 0.3, faixas: 7, ang: -16, amp: 22, fade: 'both', opacidade: 0.8 })}
    ${logo((w - lw) / 2, h * 0.12, lw)}
    <text x="${w / 2}" y="${h * 0.62}" text-anchor="middle" ${DISPLAY} font-size="84" fill="${C.giz}">KIT DO ATLETA</text>
    <text x="${w / 2}" y="${h * 0.62 + 58}" text-anchor="middle" ${APOIO} font-size="34" fill="${C.fumaca}" letter-spacing="6">FOTOS OFICIAIS EM BREVE</text>
    ${acabamento(w, h)}`);
}

const ARTES = [
  ['fundo-home.png', () => fundoRetrato(853, 1844, 1)],
  ['fundo-cadastro.png', () => fundoRetrato(852, 1846, 2)],
  ['fundo-pagamento.png', () => fundoRetrato(853, 1844, 3)],
  ['fundo-login-atleta.png', () => fundoRetrato(941, 1672, 4)],
  ['fundo-premio.png', () => fundoPremio(941, 1672)],
  ['fundo-card-atleta.png', () => fundoCardAtleta(1719, 915)],
  ['header.png', () => cabecalhoPdf(2172, 724)],
  ['page-transition.png', () => transicaoPdf(1572, 1001)],
  ['modelo-card.png', () => cardEuVou(1122, 1402, false)],
  ['modelo-card-kids.png', () => cardEuVou(1122, 1402, true)],
  ['kit-em-breve.jpg', () => kitEmBreve(720, 1280)],
];

const filtro = process.argv.slice(2);
for (const [nome, fazer] of ARTES) {
  if (filtro.length && !filtro.includes(nome)) continue;
  const img = sharp(Buffer.from(fazer()));
  const destino = path.join(SAIDA, nome);
  if (nome.endsWith('.jpg')) await img.jpeg({ quality: 86, mozjpeg: true }).toFile(destino);
  else await img.png({ compressionLevel: 9, palette: false }).toFile(destino);
  console.log('ok', nome, `${(fs.statSync(destino).size / 1024).toFixed(0)} KB`);
}

