# WhatsApp Sales Automation Bot

Este documento detalha o plano de implementação técnica para a automação de vendas via WhatsApp, voltada para Biscoitos Decorados e Macarons, com integrações ao Google Drive e Google Calendar.

## User Review Required

> [!IMPORTANT]
> A integração com o Google Drive e o Google Calendar exige a criação de credenciais no Google Cloud Console (Service Account ou OAuth2). Precisaremos que você gere um arquivo de credenciais (`credentials.json`) para que o bot possa autenticar e interagir com suas pastas e sua agenda.
> 
> Além disso, usaremos a biblioteca `whatsapp-web.js`, que funciona escaneando um QR Code gerado no terminal pelo seu WhatsApp (como se fosse o WhatsApp Web). Isso significa que você precisará ter um número de WhatsApp dedicado (ou o seu atual) conectado.

## Open Questions

> [!WARNING]
> 1. **Geração do PIX:** Você possui chave PIX (CPF/CNPJ, e-mail, celular ou aleatória)? Precisaremos dos dados exatos (Chave PIX, Nome do Titular e Cidade) para gerar o código Copia e Cola automaticamente.
> 2. **Infraestrutura:** Como é um bot contínuo (com cronogramas de aviso 24h antes e 2 dias depois), ele precisa rodar 24/7. Você planeja rodar este bot no seu próprio computador localmente ou hospedá-lo em algum serviço (como AWS, VPS, Heroku, etc.)?
> 3. **Número de Transbordo (Falar com Raquel):** O bot irá encaminhar as mensagens para qual número de WhatsApp quando o cliente pedir para falar com você?
> 4. **Links do Google Drive:** Você prefere que o bot envie as fotos diretamente no WhatsApp (baixadas do Drive) ou apenas envie os links para o cliente abrir? (Enviar a foto diretamente costuma dar uma experiência melhor).

## Proposed Changes

A arquitetura do projeto será baseada em **Node.js** com **TypeScript** para maior robustez. Usaremos um banco de dados local simples (`SQLite`) para gerenciar o estado da conversa dos clientes, os carrinhos de compra e os agendamentos das mensagens automáticas.

O projeto será criado em uma nova pasta `whatsapp-sales-bot`.

### 1. Estrutura Base e Dependências
#### [NEW] `whatsapp-sales-bot/package.json`
Inicialização do projeto Node.js com as seguintes dependências principais:
- `whatsapp-web.js` e `qrcode-terminal`: Para a automação do WhatsApp.
- `googleapis`: Para conexão com Google Drive e Calendar.
- `sqlite3` e `typeorm` (ou Prisma/Knex): Para salvar os carrinhos e agendamentos.
- `node-cron`: Para checar e enviar as mensagens programadas (24h antes e 2 dias pós-venda).
- `pix-payload-generator`: Para gerar o código PIX Copia e Cola.

### 2. Integrações (Serviços)
#### [NEW] `whatsapp-sales-bot/src/services/googleService.ts`
Responsável por:
- Autenticar com a API do Google usando as credenciais.
- **Drive:** Buscar até 4 imagens com base no termo digitado (tema do biscoito).
- **Calendar:** Contar eventos na semana planejada e criar novos eventos com os detalhes do pedido.

#### [NEW] `whatsapp-sales-bot/src/services/whatsappService.ts`
Responsável por:
- Inicializar o cliente do WhatsApp.
- Enviar mensagens, imagens e lidar com a geração de QR Code.
- Redirecionar logs de conversa para o número da Raquel.

#### [NEW] `whatsapp-sales-bot/src/services/paymentService.ts`
Responsável por:
- Receber o valor total e gerar um código PIX Copia e Cola para pagamento.

### 3. Máquina de Estado e Fluxo de Conversa
#### [NEW] `whatsapp-sales-bot/src/flow/conversationHandler.ts`
Controla em qual "passo" o cliente está (ex: `MENU_INICIAL`, `ESCOLHENDO_CATEGORIA`, `ESCOLHENDO_MODELO_BISCOITO`, `ESCOLHENDO_COR_MACARON`, `FECHAMENTO`).

#### [NEW] `whatsapp-sales-bot/src/flow/states/*`
Classes ou funções para cada etapa do atendimento, contendo a lógica de:
- Saudações e Menu.
- Lógica de Biscoitos (busca no Drive e quantidade).
- Lógica de Macarons (cor, quantidade e recheio).
- Resumo, cálculo de data (14 dias) e verificação do limite de 15 pedidos.

### 4. Agendador (Lembretes e Pós-Venda)
#### [NEW] `whatsapp-sales-bot/src/jobs/scheduler.ts`
Um script rodando via `node-cron` a cada hora que:
- Busca no banco de dados pedidos agendados para dali a 24 horas e dispara a mensagem de lembrete.
- Busca pedidos finalizados há 2 dias e dispara a mensagem de feedback.

## Verification Plan

### Automated Tests / Scripts
- Desenvolver um script de teste para validar a autenticação das APIs do Google independentemente do WhatsApp.
- Testar a geração do PIX para confirmar que qualquer app bancário faz a leitura correta.

### Manual Verification
- Iniciar o bot, escanear o QR Code.
- Simular fluxos completos de compra como um cliente normal (tanto biscoitos quanto macarons).
- Verificar se a busca no Google Drive retorna os arquivos certos.
- Verificar se o evento é criado corretamente no Google Calendar.
- Solicitar transbordo e validar se a Raquel recebe o log da conversa no seu número.
