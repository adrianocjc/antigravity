# Walkthrough: WhatsApp Sales Automation Bot

Finalizei a construção da estrutura base do seu bot de vendas de Biscoitos Decorados e Macarons. 
Aqui está um resumo de tudo o que foi implementado e do fluxo que o código atende:

## Arquitetura e Arquivos Criados

O projeto foi estruturado em uma nova pasta `whatsapp-sales-bot`, separando as responsabilidades:

1. **`package.json` e `tsconfig.json`**:
   - Foram configuradas as dependências modernas (`whatsapp-web.js`, `googleapis`, `better-sqlite3`, etc.) e o ambiente TypeScript para maior segurança do código.

2. **Serviços de Integração (`src/services/`)**:
   - `whatsappService.ts`: Configura o cliente do WhatsApp para gerar o QR Code no terminal e ouvir mensagens.
   - `googleService.ts`: Faz a busca de fotos no Google Drive (baseado no termo da pesquisa) e agenda/conta eventos no Google Calendar.
   - `paymentService.ts`: Gera automaticamente um PIX "Copia e Cola" e o QR Code em imagem com base no valor total do pedido.
   - `databaseService.ts`: Usa o SQLite para guardar a "Sessão" de cada usuário (onde ele está no fluxo), os carrinhos, os pedidos finalizados e a lista de mensagens a serem enviadas no futuro.

3. **Fluxo de Conversa (`src/flow/conversationHandler.ts`)**:
   - Este arquivo concentra o coração do bot. Ele usa uma "Máquina de Estados" para saber exatamente o que perguntar a seguir.
   - Trata as escolhas de **Biscoitos** (busca de tema e quantidade).
   - Trata as escolhas de **Macarons** (cor, quantidade e recheio).
   - Avalia a capacidade de agendamento: soma 14 dias da data atual, verifica o Google Calendar e remarca para +7 dias caso o limite de 15 seja excedido.
   - O recurso de **Transbordo Humano** ("Falar com Raquel") envia as mensagens para um número específico cadastrado, junto com os itens já no carrinho.

4. **Agendamento (`src/jobs/scheduler.ts`)**:
   - Uma rotina rodando de hora em hora.
   - Verifica se há mensagens agendadas de "Lembrete 24h" ou "Pós-Venda 2 dias" para disparar.

5. **`index.ts` e `.env`**:
   - O `index.ts` é o ponto de entrada principal que inicializa o cron (agendador) e a conexão do WhatsApp.
   - O `.env` contém o template onde você preencherá as chaves do Google, os dados do seu PIX e o número de telefone da Raquel para as notificações de transbordo.

## Próximos Passos (Manual do Usuário)

Como a infraestrutura foi montada e o código TypeScript criado, os próximos passos práticos de sua parte são:

1. **Instalar o Node.js:** (Caso não possua instalado no Windows).
2. **Executar a instalação:**
   - Abrir o terminal dentro da pasta `whatsapp-sales-bot`
   - Rodar `npm install`
3. **Configurar as Variáveis (Arquivo `.env`):**
   - Inserir a chave PIX, seu número de telefone e as credenciais do Google Cloud (`GOOGLE_SERVICE_ACCOUNT_EMAIL` e `GOOGLE_PRIVATE_KEY`).
4. **Executar o Bot:**
   - Rodar `npm run dev` (em ambiente de teste) ou `npm run build` seguido de `npm start`.
   - Um **QR Code** aparecerá no terminal. Basta escaneá-lo com o WhatsApp (seja um novo número ou o seu próprio) que você quer que funcione como o robô.

O código já está inteiramente configurado para cobrir todas as lógicas de negócio do planejamento!
