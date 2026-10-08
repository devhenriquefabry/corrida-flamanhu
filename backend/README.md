# Configuração do sistema de inscrições

O código não aponta para nenhuma conta. Tudo que é da Corrida Flamanhu fica em:

| Onde | O quê |
|---|---|
| `sistema/src/config/evento.ts` | nome, data, local, e-mail, grupo de WhatsApp, Instagram, número de boas-vindas |
| `backend/worker/wrangler.toml` `[vars]` | os mesmos dados do evento (para mensagens enviadas pelo worker) + URLs das integrações |
| `.env.local` (local) / GitHub Variables (deploy) | config web do Firebase e URL do worker |
| `npx wrangler secret put` | chaves secretas (Asaas, Cora, Evolution, Hub) — nunca no código |

Siga na ordem — cada etapa usa algo da anterior.

## 1. Firebase (banco + login)

1. Crie um projeto em <https://console.firebase.google.com>.
2. **Firestore Database** → Criar banco (região `southamerica-east1`).
3. **Authentication** → Método de login → ative **E-mail/senha**.
4. **Configurações do projeto → Seus apps → Web (`</>`)** → registre o app e copie o `firebaseConfig`.
5. Preencha `.env.local` (modelo em `.env.example`) com esses valores.
6. Publique as regras e índices (o projeto já está em `firebase/.firebaserc`):
   ```bash
   npx firebase login
   npm run test:regras     # testes das regras no emulador (precisa de Java)
   npm run deploy:regras
   ```
7. Rode o site (`npm run dev`), abra `/admin/login` e entre com o e-mail/senha que
   quiser: com o banco vazio, o sistema oferece criar o **primeiro administrador**.

> ⚠️ **Antes de abrir inscrições:** as regras ainda deixam `nightrun_registrations`
> com leitura pública, porque o login do atleta roda no navegador. Isso fecha na
> fase 2, quando o login do atleta passar pelo worker (ver topo de `firestore.rules`).

## 2. Worker da API (`backend/worker`)

Pagamentos, webhooks, fila de WhatsApp, upload de mídias e cards.

```bash
cd backend/worker
npm install
npx wrangler login
npx wrangler kv namespace create NIGHTRUN_STORAGE   # cole o id em wrangler.toml
npx wrangler r2 bucket create corrida-flamanhu-media
```

Em `wrangler.toml` `[vars]`, preencha `FIREBASE_PROJECT_ID`, `FIREBASE_API_KEY`
(os mesmos do passo 1), `EVOLUTION_URL` (passo 4) e os dados do evento.

Conta de serviço do Firebase (obrigatória: é com ela que o worker acessa o banco).
Em *Firebase → Configurações do projeto → Contas de serviço → Gerar nova chave
privada*, baixe o JSON, guarde **fora do projeto** e cadastre direto do arquivo:

```powershell
Get-Content "$HOME\Downloads\chave-firebase.json" -Raw | npx wrangler secret put FIREBASE_SERVICE_ACCOUNT
```

Demais segredos (lista completa em `.dev.vars.example`):

```bash
npx wrangler secret put ASAAS_API_KEY
npx wrangler secret put ASAAS_WEBHOOK_SECRET
```

```bash
npx wrangler deploy
```

O deploy imprime a URL (`https://corrida-flamanhu-api.<sub>.workers.dev`): coloque-a
em `NEXT_PUBLIC_WORKER_URL` no `.env.local` e nas Variables do GitHub.

## 3. Pagamentos

**Asaas** (mais simples): crie a conta, gere a chave em *Integrações → Chave de API*
(`ASAAS_API_KEY` acima) e cadastre o webhook em *Integrações → Webhooks* apontando
para `https://<url-do-worker>/asaas/webhook`, com o token igual a `ASAAS_WEBHOOK_SECRET`.
Para testar sem dinheiro de verdade, use uma conta sandbox e troque `ASAAS_BASE_URL`
para `https://api-sandbox.asaas.com/v3` — só no seu `.dev.vars`/teste local, nunca no
`wrangler.toml` (um teste do projeto barra isso).

**Cora** (opcional): exige certificado mTLS emitido pela Cora. Siga os comentários
de `[[mtls_certificates]]` no `wrangler.toml` e cadastre `CORA_CLIENT_ID`,
`CORA_CLIENT_SECRET` e `CORA_WEBHOOK_SECRET`. A tela *Admin → Integrações* mostra o
status de cada item e a URL do webhook.

O banco ativo é escolhido no painel (*Admin → Integrações*).

## 4. WhatsApp

- `backend/evolution` — servidor Evolution API (conecta o número via QR code).
  Roteiro no `README.md` da pasta. O `AUTHENTICATION_API_KEY` de lá vira o
  `EVOLUTION_API_KEY` do worker.
- `backend/whatsapp-hub` — fila com retry e vários números. Opcional no começo:
  sem ele o worker envia direto pela Evolution. Para ativar, crie o D1 e o KV
  (comandos no `wrangler.toml`), faça o deploy, descomente `[[services]]` no
  `wrangler.toml` do worker e cadastre `WHATSAPP_HUB_API_KEY`.

## 5. Deploy do site (GitHub Pages)

No GitHub: *Settings → Secrets and variables → Actions → aba Variables*, crie as
mesmas `NEXT_PUBLIC_*` do `.env.local` (menos a do Groq). O próximo push na `main`
publica o site já ligado ao seu Firebase e ao seu worker.

Se trocar o endereço do site (domínio próprio), atualize `SITE_URL` no
`wrangler.toml` do worker — é com ele que o worker monta os links de pagamento.
