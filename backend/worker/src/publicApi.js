// Rotas que o site público chama no lugar de ler inscrições direto do Firestore.
// Com as regras fechadas, o navegador não lista mais nightrun_registrations: o
// worker (conta de serviço, ver firestoreAuth.js) faz a consulta e devolve só o
// necessário para cada tela.
import { hasFirestoreServiceAccount } from "./firestoreAuth.js";

const REGISTRATIONS = "nightrun_registrations";
const SORTEIOS = "nightrun_sorteios";
const LOGIN_INVALIDO = "E-mail ou senha incorretos.";

// ---------- Firestore REST ----------

const documentsUrl = (env) =>
  `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;

function fromValue(value) {
  if (!value || "nullValue" in value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(fromValue);
  if ("mapValue" in value) return fromFields(value.mapValue.fields);
  return null;
}

function fromFields(fields = {}) {
  const out = {};
  for (const [key, value] of Object.entries(fields || {})) out[key] = fromValue(value);
  return out;
}

function toValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toValue) } };
  if (typeof value === "object") return { mapValue: { fields: toFields(value) } };
  return { stringValue: String(value) };
}

function toFields(data) {
  const out = {};
  for (const [key, value] of Object.entries(data)) out[key] = toValue(value);
  return out;
}

const docId = (name) => String(name).split("/").pop();

async function getDocument(env, collection, id) {
  const res = await fetch(`${documentsUrl(env)}/${collection}/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore get ${collection}/${id}: ${res.status}`);
  const data = await res.json();
  return { id: docId(data.name), data: fromFields(data.fields) };
}

// where: [campo, valor] (igualdade) ou null; fields: projeção (só esses campos voltam)
async function queryCollection(env, collection, where, fields) {
  const structuredQuery = { from: [{ collectionId: collection }] };
  if (where) {
    structuredQuery.where = {
      fieldFilter: { field: { fieldPath: where[0] }, op: "EQUAL", value: toValue(where[1]) },
    };
  }
  if (fields) structuredQuery.select = { fields: fields.map((fieldPath) => ({ fieldPath })) };

  const res = await fetch(`${documentsUrl(env)}:runQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ structuredQuery }),
  });
  if (!res.ok) throw new Error(`Firestore runQuery ${collection}: ${res.status}`);
  const rows = await res.json();
  return rows
    .filter((row) => row.document)
    .map((row) => ({ id: docId(row.document.name), data: fromFields(row.document.fields) }));
}

async function countCollection(env, collection) {
  const res = await fetch(`${documentsUrl(env)}:runAggregationQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      structuredAggregationQuery: {
        structuredQuery: { from: [{ collectionId: collection }] },
        aggregations: [{ alias: "total", count: {} }],
      },
    }),
  });
  if (!res.ok) throw new Error(`Firestore count ${collection}: ${res.status}`);
  const rows = await res.json();
  const total = rows?.[0]?.result?.aggregateFields?.total;
  return Number(total?.integerValue ?? 0);
}

async function updateDocument(env, collection, id, data) {
  const mask = Object.keys(data).map((key) => `updateMask.fieldPaths=${encodeURIComponent(key)}`).join("&");
  const res = await fetch(`${documentsUrl(env)}/${collection}/${encodeURIComponent(id)}?${mask}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: toFields(data) }),
  });
  if (!res.ok) throw new Error(`Firestore update ${collection}/${id}: ${res.status} ${await res.text()}`);
}

// ---------- limite de tentativas (KV) ----------

// Conta tentativas numa janela de 15 min. O CPF tem só 9 dígitos livres: sem
// limite, dava para descobrir o de alguém por força bruta sabendo o e-mail.
export async function tooManyAttempts(env, key, max) {
  if (!env.NIGHTRUN_STORAGE) return false;
  const fullKey = `ratelimit:${key}`;
  const current = Number(await env.NIGHTRUN_STORAGE.get(fullKey)) || 0;
  if (current >= max) return true;
  await env.NIGHTRUN_STORAGE.put(fullKey, String(current + 1), { expirationTtl: 900 });
  return false;
}

// Cache curto: o painel faz várias chamadas por tela e cada uma passa por aqui.
// Admin removido perde o acesso em até 1 minuto.
const adminCache = new Map(); // email -> { isAdmin, at }

export async function isAdminEmail(env, email) {
  if (!email) return false;
  const cached = adminCache.get(email);
  if (cached && Date.now() - cached.at < 60_000) return cached.isAdmin;
  const isAdmin = Boolean(await getDocument(env, "nightrun_admins", email));
  adminCache.set(email, { isAdmin, at: Date.now() });
  return isAdmin;
}

// ---------- aviso de nova inscrição (WhatsApp do organizador) ----------

const CATEGORIAS = { adulto: "ADULTO / ADOLESCENTE", infantil: "INFANTIL (até 12 anos)" };
const formatMoney = (cents) =>
  (Number(cents || 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Mesmo texto que o formulário montava no navegador (PublicForm.tsx), agora
// a partir do que está gravado no banco.
function formatRegistrationNotice(reg, paymentPageUrl) {
  const endereco = reg.endereco || {};
  const contato = reg.contatoEmergencia || {};
  const saude = reg.saude || {};
  return `Novo atleta preencheu o formulario:\n\n` +
    `*Nome:* ${reg.nome || "-"}\n` +
    `*CPF:* ${reg.cpf || "-"}\n` +
    `*Nascimento:* ${reg.dataNascimento || "-"}\n` +
    `*Responsavel:* ${reg.responsavelNome || "-"}\n` +
    `*CPF Responsavel:* ${reg.responsavelCpf || "-"}\n` +
    `*Sexo:* ${reg.sexo || "-"}\n` +
    `*E-mail:* ${reg.email || "-"}\n` +
    `*WhatsApp:* ${reg.telefone || "-"}\n` +
    `*PCD:* ${reg.pcd ? "Sim" : "Nao"}\n` +
    `*Servidor publico municipal:* ${reg.servidorPublicoMunicipal ? "Sim" : "Nao"}\n` +
    `*Matricula servidor:* ${reg.matriculaServidor || "-"}\n` +
    `*Equipe:* ${reg.integranteEquipe === "sim" ? (reg.equipeNome || "Sim") : "Nao"}\n\n` +
    `*Categoria:* ${CATEGORIAS[reg.categoria] || reg.categoria || "-"}\n` +
    `*Prova:* ${reg.modalidadeNome || "-"}\n` +
    `*Kit:* ${reg.kitNome || reg.kit || "-"}\n` +
    `*Camiseta:* ${reg.tamanhoCamiseta || "-"}\n` +
    `*Valor:* ${formatMoney(reg.amount)}\n\n` +
    `*Endereco:* ${endereco.rua || "-"}, ${endereco.numero || "-"} - ${endereco.bairro || "-"}, ${endereco.cidade || "-"}-${endereco.uf || "-"}\n` +
    `*CEP:* ${endereco.cep || "-"}\n\n` +
    `*Contato de emergencia:* ${contato.nome || "-"}\n` +
    `*Telefone emergencia:* ${contato.telefone || "-"}\n` +
    `*Parentesco:* ${contato.parentesco || "-"}\n\n` +
    `*Saude:* ${saude.condicaoSaude || "-"}\n` +
    `*Alergia:* ${saude.temAlergia ? (saude.alergiaDesc || "Sim") : "Nao"}\n` +
    `*Medicamento:* ${saude.tomaMedicamento ? (saude.medicamentoDesc || "Sim") : "Nao"}\n\n` +
    `*Pagamento:* ${paymentPageUrl}\n` +
    (reg.invoiceUrl ? `*Link direto do banco:* ${reg.invoiceUrl}` : "");
}

// ---------- regras de negócio (espelho de sistema/src/utils/sorteioUtils.ts) ----------

const digits = (value) => String(value || "").replace(/\D/g, "");
const normalizeCouponCode = (value) => String(value || "").trim().toUpperCase().replace(/\s+/g, "");

function isRegistrationEligible(registration, tipo, couponCode) {
  if (registration.paymentStatus !== "pago") return false;
  if (tipo !== "cupom") return true;
  return normalizeCouponCode(registration.couponCode) === normalizeCouponCode(couponCode);
}

// Fisher-Yates com crypto e rejeição de amostragem (sem viés de módulo)
function randomBelow(limit) {
  const max = Math.floor(0xffffffff / limit) * limit;
  const buffer = new Uint32Array(1);
  do crypto.getRandomValues(buffer); while (buffer[0] >= max);
  return buffer[0] % limit;
}

function pickRandomUnbiased(items, quantity) {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = randomBelow(i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.max(0, Math.min(quantity, pool.length)));
}

async function loadAuthorizedSorteio(env, sorteioId, token) {
  if (!sorteioId || !token) return null;
  const sorteio = await getDocument(env, SORTEIOS, sorteioId);
  if (!sorteio || !sorteio.data.operatorToken || sorteio.data.operatorToken !== token) return null;
  return sorteio;
}

async function listElegiveis(env, sorteio) {
  const tipo = sorteio.data.tipo === "cupom" ? "cupom" : "geral";
  const [pagas, sorteios] = await Promise.all([
    queryCollection(env, REGISTRATIONS, ["paymentStatus", "pago"], ["paymentStatus", "couponCode", "nome", "telefone", "fotoUrl"]),
    queryCollection(env, SORTEIOS, null, ["ganhadorIds"]),
  ]);
  // quem já ganhou outro sorteio não concorre de novo
  const jaGanharam = new Set();
  for (const item of sorteios) {
    if (item.id === sorteio.id) continue;
    for (const id of item.data.ganhadorIds || []) jaGanharam.add(String(id));
  }
  return pagas.filter((item) =>
    isRegistrationEligible(item.data, tipo, sorteio.data.couponCode) && !jaGanharam.has(item.id)
  );
}

// ---------- rotas ----------

let totalCache = { value: 0, at: 0 };

// deps: { sendWhatsApp(msg), enqueueWhatsApp(messages) } — funções do index.js
export async function handlePublicApi(request, env, path, json, deps = {}) {
  if (!path.startsWith("/public/")) return null;
  if (!hasFirestoreServiceAccount()) {
    return json({ error: "Worker sem FIREBASE_SERVICE_ACCOUNT configurada." }, 503);
  }

  // Aviso de nova inscrição para o WhatsApp do organizador. O formulário só
  // informa o ID: destinatário e texto saem daqui (o /whatsapp/send aberto
  // deixava qualquer um mandar qualquer mensagem pelo número da corrida).
  // Uma vez por inscrição.
  if (path === "/public/inscricao/aviso" && request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    const registrationId = String(body.registrationId || "");
    const lockKey = `notice:registration:${registrationId}`;
    if (!registrationId || !env.NIGHTRUN_STORAGE) return json({ error: "Inscrição inválida." }, 400);
    if (await env.NIGHTRUN_STORAGE.get(lockKey)) return json({ skipped: "already_sent" });

    const [reg, settings] = await Promise.all([
      getDocument(env, REGISTRATIONS, registrationId),
      getDocument(env, "nightrun_settings", "whatsapp_registration_notice"),
    ]);
    if (!reg) return json({ error: "Inscrição não encontrada." }, 404);
    const phone = digits(settings?.data.registrationNoticePhone);
    if (!settings?.data.receiveRegistrationNoticeEnabled || !phone) return json({ skipped: "disabled" });

    await env.NIGHTRUN_STORAGE.put(lockKey, new Date().toISOString(), { expirationTtl: 90 * 86400 });
    const siteUrl = String(env.SITE_URL || "").replace(/\/+$/, "");
    const message = {
      phone: phone.startsWith("55") ? phone : `55${phone}`,
      text: formatRegistrationNotice(reg.data, `${siteUrl}/inscricao/pagamento/${reg.id}`),
      type: "registration_notice",
      alunoNome: reg.data.nome || "",
      registrationId: reg.id,
    };
    const sent = deps.sendWhatsApp
      ? await deps.sendWhatsApp(message).catch((error) => ({ success: false, error: error.message }))
      : { success: false };
    if (sent?.success !== false) return json({ success: true });
    if (deps.enqueueWhatsApp) await deps.enqueueWhatsApp([message]);
    return json({ success: true, queued: true });
  }

  // Login do atleta: e-mail + CPF conferidos aqui, nunca no navegador.
  if (path === "/public/atleta/login" && request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const cpf = digits(body.cpf);
    if (!email || cpf.length !== 11) return json({ error: LOGIN_INVALIDO }, 401);

    const ip = request.headers.get("CF-Connecting-IP") || "sem-ip";
    if (await tooManyAttempts(env, `atleta-login:ip:${ip}`, 30) ||
        await tooManyAttempts(env, `atleta-login:email:${email}`, 10)) {
      return json({ error: "Muitas tentativas. Aguarde 15 minutos e tente de novo." }, 429);
    }

    const inscricoes = await queryCollection(env, REGISTRATIONS, ["email", email], ["cpf"]);
    const inscricao = inscricoes.find((item) => digits(item.data.cpf) === cpf);
    if (!inscricao) return json({ error: LOGIN_INVALIDO }, 401);
    return json({ registrationId: inscricao.id });
  }

  // Inscrições ligadas a esta: mesmo e-mail, ou telefone que aparece como
  // contato de emergência de um lado ou de outro. Devolve só o que o painel mostra.
  if (path === "/public/atleta/vinculados" && request.method === "GET") {
    const id = new URL(request.url).searchParams.get("id") || "";
    const reg = id ? await getDocument(env, REGISTRATIONS, id) : null;
    if (!reg) return json({ error: "Inscrição não encontrada." }, 404);

    const meuEmail = String(reg.data.email || "").trim().toLowerCase();
    const meuTelefone = digits(reg.data.telefone);
    const meuContatoTelefone = digits(reg.data.contatoEmergencia?.telefone);

    const todas = await queryCollection(env, REGISTRATIONS, null, [
      "nome", "email", "telefone", "contatoEmergencia", "paymentStatus", "fotoUrl", "integranteEquipe", "equipeNome",
    ]);
    const vinculados = todas
      .filter(({ id: outroId, data: outro }) => {
        if (outroId === reg.id) return false;
        const mesmoEmail = !!meuEmail && meuEmail === String(outro.email || "").trim().toLowerCase();
        const souContatoDele = !!meuTelefone && meuTelefone === digits(outro.contatoEmergencia?.telefone);
        const eleEhMeuContato = !!meuContatoTelefone && meuContatoTelefone === digits(outro.telefone);
        return mesmoEmail || souContatoDele || eleEhMeuContato;
      })
      .map(({ id: outroId, data }) => ({
        id: outroId,
        nome: data.nome || "",
        fotoUrl: data.fotoUrl || "",
        paymentStatus: data.paymentStatus || "",
        integranteEquipe: data.integranteEquipe || "",
        equipeNome: data.equipeNome || "",
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    return json({ vinculados });
  }

  // Total de inscrições (contador de vagas e virada de lote). Cache curto: é
  // chamado a cada visita da página inicial.
  if (path === "/public/inscricoes/total" && request.method === "GET") {
    if (Date.now() - totalCache.at > 20_000) {
      totalCache = { value: await countCollection(env, REGISTRATIONS), at: Date.now() };
    }
    return json({ total: totalCache.value });
  }

  // Sorteio pelo link do coordenador: o token é conferido aqui e o sorteio roda
  // no servidor — o navegador não lista inscrições nem grava o resultado.
  if ((path === "/public/sorteios/elegiveis" || path === "/public/sorteios/sortear") && request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    const sorteio = await loadAuthorizedSorteio(env, String(body.sorteioId || ""), String(body.token || ""));
    if (!sorteio) return json({ error: "Link de coordenador inválido." }, 403);

    const elegiveis = await listElegiveis(env, sorteio);
    if (path === "/public/sorteios/elegiveis") return json({ elegiveis: elegiveis.length });

    if (sorteio.data.status === "finalizado") return json({ error: "Este sorteio já foi realizado." }, 409);
    if (elegiveis.length === 0) {
      return json({
        error: sorteio.data.tipo === "cupom"
          ? `Nenhum inscrito elegível: ninguém pagou usando o cupom ${sorteio.data.couponCode || "-"} (ou todos já ganharam).`
          : "Nenhum inscrito elegível: não há pagamentos confirmados disponíveis.",
      }, 422);
    }

    const quantidade = Math.max(1, Number(sorteio.data.quantidadeGanhadores || 1));
    const ganhadores = pickRandomUnbiased(elegiveis, quantidade).map(({ id, data }) => ({
      registrationId: id,
      nome: data.nome || "Atleta",
      telefone: data.telefone || "",
      fotoUrl: data.fotoUrl || "",
      visualizouEm: null,
      whatsappEnviadoEm: null,
      whatsappEnviosCount: 0,
    }));
    const now = new Date();
    await updateDocument(env, SORTEIOS, sorteio.id, {
      ganhadores,
      ganhadorIds: ganhadores.map((item) => item.registrationId),
      totalElegiveis: elegiveis.length,
      sorteadoEm: now,
      status: "finalizado",
      updatedAt: now,
    });
    return json({ ganhadores: ganhadores.length, elegiveis: elegiveis.length });
  }

  return json({ error: "Rota não encontrada." }, 404);
}
