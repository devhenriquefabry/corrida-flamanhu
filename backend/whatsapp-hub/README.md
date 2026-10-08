# WhatsApp Hub

Microservice multi-tenant de mensageria WhatsApp agendada/transacional. Extraído do worker do sistema de inscrições — qualquer sistema (o próprio, um sistema esportivo, o próximo projeto) se cadastra como **instância** e traz seu próprio número, sua própria fonte/paleta de card e seus próprios dados.

Este README cobre o serviço em pé, com fila, roteamento de número, throttle, retry e o motor de card genérico funcionando.

## Deploy

```
https://whatsapp-hub.SEU-SUBDOMINIO.workers.dev
```

Stack: Cloudflare Workers (Hono + Zod) · D1 (`whatsapp_hub_db`) · KV (`HUB_STORAGE`) · R2 (`flamanhu-whatsapp-hub-assets`) · Cloudflare Queues (`whatsapp-hub-outbox` + DLQ).

## Conceitos

- **Instância** = tenant. Tem uma API key própria, números de WhatsApp próprios, templates próprios. Nunca enxerga dado de outra instância.
- **Número** = um "chip" na Evolution API. Pertence a exatamente uma instância. Uma instância pode ter mais de um (round-robin entre eles).
- **Template** = texto com merge fields `{{chave}}`, ou um `card_config` (cor, fonte, campos posicionados) que vira um PNG renderizado a partir do payload livre enviado em cada mensagem.
- **Mensagem** = o que efetivamente sai pro WhatsApp. Todo envio passa pela Cloudflare Queue — nunca é síncrono na chamada da API.

## Criando uma instância (bootstrap)

Só quem tem o segredo do operador do serviço (`ADMIN_BOOTSTRAP_SECRET`, um Wrangler secret) pode criar tenants:

```bash
curl -X POST https://whatsapp-hub.SEU-SUBDOMINIO.workers.dev/v1/instances \
  -H "X-Bootstrap-Secret: <segredo>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Sistema Esportivo X"}'
# → { "id": "inst_...", "apiKey": "whk_..." }  — a apiKey só aparece essa vez
```

A partir daqui, tudo é autenticado com `Authorization: Bearer whk_...`.

## Registrando um número

```bash
curl -X POST https://whatsapp-hub.SEU-SUBDOMINIO.workers.dev/v1/numbers \
  -H "Authorization: Bearer whk_..." -H "Content-Type: application/json" \
  -d '{
    "label": "Principal",
    "role": "both",
    "evolutionBaseUrl": "https://sua-evolution.fly.dev",
    "evolutionApiKey": "...",
    "evolutionInstanceName": "meu_numero"
  }'
```

Isso já dispara a criação da instância na Evolution API. Para parear (escanear QR):

```bash
curl https://whatsapp-hub.SEU-SUBDOMINIO.workers.dev/v1/numbers/<numberId>/qr \
  -H "Authorization: Bearer whk_..."
```

## Enviando uma fonte (para cards com tipografia própria)

```bash
curl -X POST https://whatsapp-hub.SEU-SUBDOMINIO.workers.dev/v1/fonts \
  -H "Authorization: Bearer whk_..." \
  -F "file=@./MinhaFonte-Bold.ttf" \
  -F "familyName=MinhaFonte"
# → { "id": "fnt_..." }
```

Aceita TTF/OTF, até 2MB. Se nenhuma fonte for referenciada num `card_config`, o Hub usa uma fonte padrão embutida.

## Criando um template

Texto:

```bash
curl -X POST .../v1/templates -H "Authorization: Bearer whk_..." -H "Content-Type: application/json" -d '{
  "name": "cobranca_pendente",
  "kind": "text",
  "textBody": "Oi {{nome}}, sua inscrição ainda está pendente. Pague aqui: {{link}}"
}'
```

Card (imagem gerada na hora):

```bash
curl -X POST .../v1/templates -H "Authorization: Bearer whk_..." -H "Content-Type: application/json" -d '{
  "name": "convocacao_jogo",
  "kind": "card",
  "cardConfig": {
    "width": 700, "height": 900,
    "backgroundColor": "#0B1F3A",
    "accentColor": "#FF7A1A",
    "fontId": "fnt_...",
    "fields": [
      { "key": "titulo", "x": 60, "y": 120, "size": 42 },
      { "key": "adversario", "x": 60, "y": 200, "size": 64 },
      { "key": "data", "x": 60, "y": 780, "size": 96, "align": "start" }
    ]
  }
}'
```

## Enviando uma mensagem

```bash
curl -X POST .../v1/messages -H "Authorization: Bearer whk_..." -H "Content-Type: application/json" -d '{
  "to": "5511999999999",
  "templateId": "tpl_...",
  "data": { "nome": "Maria", "titulo": "PRÓXIMO JOGO", "adversario": "vs. Tigres FC", "data": "14/09" },
  "requireImage": false,
  "maxAttempts": 5
}'
# → 202 { "id": "msg_...", "status": "pending" }
```

Sem `templateId`, mande `text` direto no corpo. Acompanhe:

```bash
curl .../v1/messages/msg_... -H "Authorization: Bearer whk_..."
curl ".../v1/messages?status=dead" -H "Authorization: Bearer whk_..."
```

## Envios recorrentes

```bash
# destinatários fixos, embutidos no job
curl -X POST .../v1/scheduled-jobs -H "Authorization: Bearer whk_..." -H "Content-Type: application/json" -d '{
  "templateId": "tpl_...",
  "cronExpr": "0 9 * * 1",
  "recipientsMode": "static",
  "recipientsStatic": [{ "to": "5511999999999", "data": { "nome": "Maria" } }]
}'

# ou destinatários resolvidos por um webhook que a própria instância expõe
curl -X POST .../v1/scheduled-jobs -H "Authorization: Bearer whk_..." -H "Content-Type: application/json" -d '{
  "templateId": "tpl_...",
  "cronExpr": "*/15 * * * *",
  "recipientsMode": "webhook",
  "recipientsWebhookUrl": "https://seu-sistema.com/api/whatsapp-recipients"
}'
# o Hub espera { "recipients": [{ "to": "...", "data": {...} }] } de volta
```

`cronExpr` é padrão de 5 campos (min hora dia-mês mês dia-semana). Pausar sem apagar: `PATCH /v1/scheduled-jobs/:id {"active": false}`.

## O que a Fase 1 já garante

- Fila real (Cloudflare Queue) com retry exponencial e dead-letter — nada fica preso esperando um cron.
- Throttle de 30s por número e round-robin entre números ativos da mesma instância (idêntico ao comportamento do worker de inscrições, só que escopado por tenant).
- Fallback de imagem → texto puro quando a mídia falha (a menos que `requireImage: true`).
- Renderização de card com `@resvg/resvg-wasm`, cor/fonte/campos 100% configuráveis por template, cache do PNG em R2 por hash de (template + dados).
- Isolamento total entre instâncias no schema.

