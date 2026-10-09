// Gera regulamento-corrida-flamanhu-2027.docx a partir de conteudo.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { EVENTO, INFO, AVISO_HORARIOS, SECOES, ASSINATURA } from './conteudo.mjs';

const require = createRequire(import.meta.url);
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, Footer,
  AlignmentType, HeadingLevel, WidthType, ShadingType, BorderStyle, LevelFormat,
  PageNumber, TabStopType, VerticalAlign,
} = require('docx');

const dir = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(dir, 'regulamento-corrida-flamanhu-2027.docx');
const LOGO = path.join(dir, '..', 'public', 'sistema', 'logo-corrida-flamanhu.png');
const LOGO_HENNDER = path.join(dir, 'assets', 'hennder-company-light.png'); // 1520x256

const RED = 'C8102E';
const INK = '1A1A1A';
const GREY = 'F3F0F0';
const LINE = 'D8D0D0';
const FONT = 'Calibri';

// página A4, margens de 2 cm
const PAGE_W = 11906;
const MARGIN = 1134;
const CONTENT_W = PAGE_W - MARGIN * 2; // 9638

// ---- marcação inline: {{pendência}} e **negrito** ----
function runs(text, base = {}) {
  return text.split(/(\{\{.*?\}\}|\*\*.*?\*\*)/g).filter(Boolean).map((part) => {
    if (part.startsWith('{{')) return new TextRun({ ...base, text: `[${part.slice(2, -2)}]`, highlight: 'yellow' });
    if (part.startsWith('**')) return new TextRun({ ...base, text: part.slice(2, -2), bold: true });
    return new TextRun({ ...base, text: part });
  });
}

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const hair = { style: BorderStyle.SINGLE, size: 4, color: LINE };

function cell(text, width, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill, color: 'auto' } : undefined,
    margins: { top: 70, bottom: 70, left: 120, right: 120 },
    borders: { top: hair, bottom: hair, left: hair, right: hair },
    children: [new Paragraph({
      spacing: { before: 0, after: 0 },
      children: runs(text, { font: FONT, size: 21, bold: opts.bold, color: opts.color }),
    })],
  });
}

function dataTable(item, indent) {
  const total = CONTENT_W - indent;
  const widths = item.cols.map((p) => Math.round((total * p) / 100));
  widths[widths.length - 1] = total - widths.slice(0, -1).reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    indent: { size: indent, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: item.head.map((h, i) => cell(h, widths[i], { fill: RED, bold: true, color: 'FFFFFF' })),
      }),
      ...item.rows.map((r, ri) => new TableRow({
        cantSplit: true,
        children: r.map((c, i) => cell(c, widths[i], { fill: ri % 2 ? GREY : undefined, bold: i === 0 })),
      })),
    ],
  });
}

const spacer = (after = 120) => new Paragraph({ spacing: { before: 0, after }, children: [] });

function clause(n, t, { left, hang }) {
  return new Paragraph({
    spacing: { before: 0, after: 100, line: 276 },
    indent: { left, hanging: hang },
    tabStops: [{ type: TabStopType.LEFT, position: left }],
    keepLines: true,
    children: [
      new TextRun({ text: n, bold: true, color: RED, font: FONT, size: 22 }),
      new TextRun({ text: '\t', font: FONT, size: 22 }),
      ...runs(t, { font: FONT, size: 22, color: INK }),
    ],
  });
}

function renderItem(it) {
  switch (it.k) {
    case 'c': return [clause(it.n, it.t, { left: 720, hang: 720 })];
    case 's': return [clause(it.n, it.t, { left: 1560, hang: 840 })];
    case 'p':
      return [new Paragraph({
        spacing: { before: 0, after: 100, line: 276 },
        indent: { left: 720 },
        children: runs(it.t, { font: FONT, size: 22, color: INK }),
      })];
    case 'l':
      return it.items.map((t) => new Paragraph({
        numbering: { reference: 'bullets', level: 0 },
        spacing: { before: 0, after: 60, line: 276 },
        children: runs(t, { font: FONT, size: 22, color: INK }),
      }));
    case 'table': return [dataTable(it, 720), spacer(140)];
    default: throw new Error(`item desconhecido: ${it.k}`);
  }
}

function heading(sec) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true,
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: RED, space: 4 } },
    children: [
      new TextRun({ text: `${sec.num} — `, color: RED, bold: true, font: FONT, size: 28 }),
      new TextRun({ text: sec.titulo, color: INK, bold: true, font: FONT, size: 28 }),
    ],
  });
}

// ---- capa / cabeçalho ----
const logo = fs.readFileSync(LOGO);
const capa = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120 },
    children: [new ImageRun({ type: 'png', data: logo, transformation: { width: 150, height: 137 }, altText: { title: 'Logo', description: 'Logo Corrida Flamanhu 2027', name: 'logo' } })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 40 },
    children: [new TextRun({ text: EVENTO.titulo, bold: true, color: RED, font: FONT, size: 26, characterSpacing: 60 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 40 },
    children: [new TextRun({ text: EVENTO.nome, bold: true, color: INK, font: FONT, size: 48 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: EVENTO.cidade, color: INK, font: FONT, size: 26, characterSpacing: 40 })],
  }),
];

const labelW = 2000;
const infoTable = new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: [labelW, CONTENT_W - labelW],
  rows: INFO.map(([label, value]) => new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: labelW, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: INK, color: 'auto' },
        margins: { top: 80, bottom: 80, left: 140, right: 100 },
        borders: { top: hair, bottom: hair, left: hair, right: hair },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: label, bold: true, color: 'FFFFFF', font: FONT, size: 21 })] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - labelW, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: GREY, color: 'auto' },
        margins: { top: 80, bottom: 80, left: 140, right: 140 },
        borders: { top: hair, bottom: hair, left: hair, right: hair },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: runs(value, { font: FONT, size: 21, color: INK }) })],
      }),
    ],
  })),
});

const corpo = [];
for (const sec of SECOES) {
  corpo.push(heading(sec));
  for (const it of sec.itens) corpo.push(...renderItem(it));
}

const assinatura = [
  spacer(300),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    keepNext: true,
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text: ASSINATURA.local, font: FONT, size: 22, color: INK })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    keepNext: true,
    spacing: { before: 0, after: 100 },
    children: [new ImageRun({ type: 'png', data: fs.readFileSync(LOGO_HENNDER), transformation: { width: 220, height: 37 }, altText: { title: 'Hennder Company', description: 'Logo Hennder Company', name: 'hennder' } })],
  }),
  ...ASSINATURA.linhas.map((l) => new Paragraph({
    alignment: AlignmentType.CENTER,
    keepNext: true,
    spacing: { before: 0, after: 40 },
    children: runs(l, { font: FONT, size: 22, bold: true, color: INK }),
  })),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 0 },
    children: [new TextRun({ text: ASSINATURA.nota, italics: true, font: FONT, size: 20, color: '666666' })],
  }),
];

const footer = new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: RED, space: 6 } },
    spacing: { before: 0, after: 0 },
    children: [
      new TextRun({ text: `${EVENTO.rodape}  ·  Página `, font: FONT, size: 16, color: '666666' }),
      new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: '666666' }),
      new TextRun({ text: ' de ', font: FONT, size: 16, color: '666666' }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: '666666' }),
    ],
  })],
});

const doc = new Document({
  creator: 'FlaManhu',
  title: 'Regulamento Oficial — Corrida Flamanhu 2027',
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [{
      id: 'Normal', name: 'Normal', quickFormat: true,
      run: { font: FONT, size: 22 },
    }, {
      id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { font: FONT, size: 28, bold: true },
      paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 },
    }],
  },
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1160, hanging: 300 } }, run: { color: RED, bold: true } },
      }],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: 16838 },
        margin: { top: MARGIN, bottom: 1300, left: MARGIN, right: MARGIN, footer: 560 },
      },
    },
    footers: { default: footer },
    children: [
      ...capa,
      infoTable,
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 0 },
        children: [new TextRun({ text: AVISO_HORARIOS, italics: true, font: FONT, size: 19, color: '666666' })],
      }),
      ...corpo,
      ...assinatura,
    ],
  }],
});

fs.writeFileSync(OUT, await Packer.toBuffer(doc));
console.log('ok →', OUT);
