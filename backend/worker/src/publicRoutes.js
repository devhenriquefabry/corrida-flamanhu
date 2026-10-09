// Rotas que o site público usa (formulário, página de pagamento, webhooks dos
// bancos, mídia). Todas as demais exigem o login de um admin do painel — o
// worker veio com ~40 rotas administrativas abertas (confirmar pagamento,
// apagar cobranças, enviar WhatsApp, extrato bancário...).
// /public/* (publicApi.js) é tratado antes e não passa por aqui.
export const PUBLIC_ROUTES = [
  ["GET", /^\/(docs)?$/],
  ["POST", /^\/asaas\/customers$/],
  ["POST", /^\/asaas\/payments$/],
  ["GET", /^\/asaas\/payments\/[^/]+\/pixQrCode$/],
  ["POST", /^\/asaas\/webhook$/],
  ["POST", /^\/cora\/webhook$/],
  ["POST", /^\/cora\/invoices\/pix$/],
  ["POST", /^\/registrations\/[^/]+\/check-payment$/],
  ["POST", /^\/registrations\/[^/]+\/credit-card-payment$/],
  ["POST", /^\/media\/upload$/], // confere o admin por conta própria (mediaUpload.js)
  ["GET", /^\/media\/.+/],
];

export const isPublicRoute = (method, path) =>
  PUBLIC_ROUTES.some(([routeMethod, pattern]) => routeMethod === method && pattern.test(path));
