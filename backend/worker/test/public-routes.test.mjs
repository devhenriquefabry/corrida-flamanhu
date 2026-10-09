import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { isPublicRoute } from '../src/publicRoutes.js';

test('rotas que o site público usa continuam abertas', () => {
  for (const [method, path] of [
    ['GET', '/'],
    ['GET', '/docs'],
    ['POST', '/asaas/customers'],
    ['POST', '/asaas/payments'],
    ['GET', '/asaas/payments/pay_123abc/pixQrCode'],
    ['POST', '/asaas/webhook'],
    ['POST', '/cora/webhook'],
    ['POST', '/cora/invoices/pix'],
    ['POST', '/registrations/abc123/check-payment'],
    ['POST', '/registrations/abc123/credit-card-payment'],
    ['POST', '/media/upload'],
    ['GET', '/media/nightrun_photos/1_foto.jpg'],
  ]) {
    assert.equal(isPublicRoute(method, path), true, `${method} ${path}`);
  }
});

test('rotas administrativas exigem login', () => {
  for (const [method, path] of [
    ['POST', '/payments/confirm-paid'],
    ['POST', '/registrations/abc123/confirm-payment'],
    ['POST', '/bank-invoices/asaas/delete-bulk'],
    ['POST', '/bank-invoices/asaas/cleanup-registrations'],
    ['GET', '/bank-movements'],
    ['GET', '/bank-balances'],
    ['GET', '/asaas/balance'],
    ['GET', '/asaas/payments/pay_123abc'], // detalhes de cobrança: só o QR Code é público
    ['POST', '/whatsapp/send'],
    ['POST', '/whatsapp/logout'],
    ['GET', '/whatsapp/connect'],
    ['POST', '/queue/enqueue'],
    ['POST', '/queue/clear'],
    ['POST', '/hub/messages'],
    ['POST', '/operational-summary/send-now'],
    ['GET', '/operational-summary/banner-preview'],
    ['POST', '/pending-charges/send'],
    ['POST', '/webhooks/test'],
    ['DELETE', '/media/nightrun_photos/1_foto.jpg'],
  ]) {
    assert.equal(isPublicRoute(method, path), false, `${method} ${path}`);
  }
});

// Toda chamada ao worker feita pelas páginas públicas precisa estar liberada,
// senão o atleta toma 401 no meio da inscrição.
test('páginas públicas só chamam rotas liberadas', () => {
  const pages = new URL('../../../sistema/src/pages/', import.meta.url);
  const publicPages = ['PublicForm.tsx', 'PaymentPage.tsx', 'SuccessPaymentPage.tsx', 'Home.tsx', 'AtletaDashboard.tsx', 'SorteioOperador.tsx', 'SorteioPublico.tsx', 'ClosedRegistrations.tsx'];
  assert.ok(readdirSync(pages).includes('PublicForm.tsx'));
  for (const page of publicPages) {
    const source = readFileSync(new URL(page, pages), 'utf8');
    for (const match of source.matchAll(/\$\{workerUrl\}(\/[^`?]*)/g)) {
      const path = match[1].replace(/\$\{[^}]+\}/g, 'x');
      const method = /pixQrCode|^\/media\/[^u]/.test(path) ? 'GET' : 'POST';
      assert.equal(isPublicRoute(method, path), true, `${page}: ${method} ${path}`);
    }
  }
});
