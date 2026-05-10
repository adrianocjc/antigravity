import { Client, Message, MessageMedia } from 'whatsapp-web.js';
import { dbService } from '../services/databaseService';
import { googleService } from '../services/googleService';
import { paymentService } from '../services/paymentService';
import dotenv from 'dotenv';

dotenv.config();

// Preço Fixo (Mock)
const MACARON_PRICE = 6.50;

export const handleIncomingMessage = async (msg: Message, client: Client) => {
  const phoneId = msg.from;
  const body = msg.body.trim();

  let session = dbService.getSession(phoneId);

  // Comando para Falar com Raquel
  if (body.toLowerCase() === 'falar com raquel' || body === '3') {
    await msg.reply('Aguarde um instante, estou transferindo você para a Raquel.');
    
    // Transbordo Humano
    const transbordoNumber = process.env.TRANSBORDO_NUMBER;
    if (transbordoNumber) {
      let cartInfo = 'Nenhum item selecionado ainda.';
      if (session && session.data.cart) {
        cartInfo = JSON.stringify(session.data.cart, null, 2);
      }
      const notifyText = `🚨 *ATENDIMENTO SOLICITADO* 🚨\nCliente: ${msg._data.notifyName || phoneId}\nNúmero: ${phoneId.replace('@c.us', '')}\nMensagem: "${body}"\nCarrinho Atual:\n${cartInfo}`;
      await client.sendMessage(transbordoNumber, notifyText);
    }
    
    // Limpa a sessão para que a Raquel possa assumir sem o bot intervir
    dbService.clearSession(phoneId);
    return;
  }

  if (!session) {
    session = { phoneId, state: 'MENU', data: { cart: [] } };
    dbService.setSession(phoneId, session.state, session.data);
    await sendWelcomeMenu(msg);
    return;
  }

  try {
    switch (session.state) {
      case 'MENU':
        if (body === '1') {
          session.state = 'ESCOLHENDO_CATEGORIA';
          dbService.setSession(phoneId, session.state, session.data);
          await msg.reply('Ótimo! O que você gostaria de pedir hoje?\n[A] Biscoitos Decorados\n[B] Macarons');
        } else if (body === '2') {
          await msg.reply('Ainda estamos implementando o acompanhamento de pedidos. Fale com a Raquel para saber do seu pedido.');
        } else {
          await msg.reply('Opção inválida. Responda [1] para Novo Pedido ou [2] para Acompanhar Pedido.');
        }
        break;

      case 'ESCOLHENDO_CATEGORIA':
        if (body.toUpperCase() === 'A') {
          session.state = 'BISCOITO_TEMA';
          dbService.setSession(phoneId, session.state, session.data);
          await msg.reply('Você escolheu Biscoitos Decorados! Qual o tema ou modelo desejado? (Ex: Safari, Casamento, Natal)');
        } else if (body.toUpperCase() === 'B') {
          session.state = 'MACARON_COR';
          dbService.setSession(phoneId, session.state, session.data);
          await msg.reply(`Você escolheu Macarons! O valor unitário é R$ ${MACARON_PRICE.toFixed(2)}.\nQual cor você gostaria?`);
        } else {
          await msg.reply('Opção inválida. Responda [A] para Biscoitos ou [B] para Macarons.');
        }
        break;

      case 'BISCOITO_TEMA':
        await msg.reply(`Buscando modelos para "${body}"... Aguarde um momento.`);
        const images = await googleService.searchDriveImages(body);
        
        if (images.length > 0) {
          await msg.reply('Encontrei algumas opções:');
          for (const img of images) {
            // Em um cenário real, poderíamos baixar a imagem. Aqui enviaremos o link se houver.
            if (img.webViewLink) {
              await msg.reply(img.webViewLink);
            }
          }
        } else {
          await msg.reply('Não encontrei fotos com esse tema. A Raquel pode fazer personalizado para você!');
        }
        
        session.data.currentBiscoitoTheme = body;
        session.state = 'BISCOITO_QTD';
        dbService.setSession(phoneId, session.state, session.data);
        await msg.reply('Quantos biscoitos deste modelo você vai querer? (Digite apenas números)');
        break;

      case 'BISCOITO_QTD':
        const qtdB = parseInt(body);
        if (isNaN(qtdB)) {
          await msg.reply('Por favor, digite um número válido.');
          return;
        }
        session.data.cart.push({
          type: 'Biscoito',
          theme: session.data.currentBiscoitoTheme,
          quantity: qtdB,
          price: 15.00 // Preço mock
        });
        session.state = 'RESUMO_FECHAMENTO';
        dbService.setSession(phoneId, session.state, session.data);
        await showSummary(msg, session);
        break;

      case 'MACARON_COR':
        session.data.currentMacaronColor = body;
        session.state = 'MACARON_QTD';
        dbService.setSession(phoneId, session.state, session.data);
        await msg.reply('Quantos macarons dessa cor você vai querer?');
        break;
        
      case 'MACARON_QTD':
        const qtdM = parseInt(body);
        if (isNaN(qtdM)) {
          await msg.reply('Por favor, digite um número válido.');
          return;
        }
        session.data.currentMacaronQtd = qtdM;
        session.state = 'MACARON_RECHEIO';
        dbService.setSession(phoneId, session.state, session.data);
        await msg.reply('Qual o recheio?\nOpções: Frutas Vermelhas, Ninho, Pistache, Limão Siciliano ou Brigadeiro 50% Cacau.');
        break;

      case 'MACARON_RECHEIO':
        session.data.cart.push({
          type: 'Macaron',
          color: session.data.currentMacaronColor,
          filling: body,
          quantity: session.data.currentMacaronQtd,
          price: MACARON_PRICE
        });
        session.state = 'RESUMO_FECHAMENTO';
        dbService.setSession(phoneId, session.state, session.data);
        await showSummary(msg, session);
        break;

      case 'RESUMO_FECHAMENTO':
        if (body === '1') {
          await handleCheckout(msg, session);
        } else if (body === '2') {
          await msg.reply('Adicionar mais itens... (Voltando ao menu)');
          session.state = 'ESCOLHENDO_CATEGORIA';
          dbService.setSession(phoneId, session.state, session.data);
          await msg.reply('O que mais você gostaria?\n[A] Biscoitos Decorados\n[B] Macarons');
        } else {
          await msg.reply('Opção inválida. [1] Confirmar e Pagar | [2] Adicionar mais itens');
        }
        break;

      case 'AGUARDANDO_COMPROVANTE':
        await msg.reply('Obrigado! A Raquel já foi notificada para verificar o seu comprovante. Seu pedido está confirmado e agendado!');
        // Envia notificação com comprovante pra Raquel
        const transbordoNumberConfirm = process.env.TRANSBORDO_NUMBER;
        if (transbordoNumberConfirm) {
          await client.sendMessage(transbordoNumberConfirm, `Comprovante recebido do cliente ${phoneId.replace('@c.us', '')}`);
          if (msg.hasMedia) {
             const media = await msg.downloadMedia();
             await client.sendMessage(transbordoNumberConfirm, media, { caption: 'Comprovante em anexo' });
          }
        }
        dbService.clearSession(phoneId);
        break;

      default:
        dbService.clearSession(phoneId);
        await sendWelcomeMenu(msg);
        break;
    }
  } catch (error) {
    console.error('Erro no fluxo:', error);
    await msg.reply('Ocorreu um erro no sistema. Tente novamente mais tarde ou digite "Falar com Raquel".');
  }
};

const sendWelcomeMenu = async (msg: Message) => {
  await msg.reply(`Olá! Seja bem-vindo(a) à Doceria da Raquel 🍪🧁\nComo posso ajudar hoje?\n\n[1] Novo Pedido\n[2] Acompanhar Pedido\n[3] Falar com Raquel Xavier`);
};

const showSummary = async (msg: Message, session: any) => {
  let resumo = '*RESUMO DO SEU PEDIDO:*\n\n';
  let total = 0;

  session.data.cart.forEach((item: any, index: number) => {
    let itemTotal = item.quantity * item.price;
    total += itemTotal;
    if (item.type === 'Biscoito') {
      resumo += `${index + 1}. Biscoito Decorado (${item.theme}) - ${item.quantity}x R$ ${item.price.toFixed(2)} = R$ ${itemTotal.toFixed(2)}\n`;
    } else {
      resumo += `${index + 1}. Macaron (${item.color}, ${item.filling}) - ${item.quantity}x R$ ${item.price.toFixed(2)} = R$ ${itemTotal.toFixed(2)}\n`;
    }
  });

  resumo += `\n*VALOR TOTAL: R$ ${total.toFixed(2)}*\n\n`;
  resumo += `O que deseja fazer?\n[1] Confirmar e Pagar\n[2] Adicionar mais itens\n[3] Falar com Raquel Xavier`;
  
  await msg.reply(resumo);
};

const handleCheckout = async (msg: Message, session: any) => {
  await msg.reply('Verificando disponibilidade na agenda...');
  
  // Data de entrega = Hoje + 14 dias
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 14);

  // Verificar limite de 15 pedidos na semana da entrega
  const eventCount = await googleService.countEventsInWeek(deliveryDate);
  
  if (eventCount >= 15) {
    // Sugere pra próxima semana (+21 dias)
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    await msg.reply(`Nossa agenda para a semana do dia ${deliveryDate.toLocaleDateString('pt-BR')} já está lotada (limite de 15 pedidos alcançado). 😔\n\nMas não se preocupe! Remarcamos automaticamente para a próxima data disponível: ${deliveryDate.toLocaleDateString('pt-BR')}.`);
  } else {
    await msg.reply(`Sua entrega está prevista para ${deliveryDate.toLocaleDateString('pt-BR')}. Temos vaga na agenda! (${15 - eventCount} vagas restantes na semana).`);
  }

  // Calcular Total
  let total = 0;
  session.data.cart.forEach((item: any) => total += (item.quantity * item.price));

  // Gerar PIX
  try {
    const pixData = await paymentService.generatePixPayload(total);
    await msg.reply(`O valor total é R$ ${total.toFixed(2)}.\n\nAqui está a sua chave PIX Copia e Cola:\n\n${pixData.payload}\n\nPor favor, envie o comprovante nesta mesma conversa após o pagamento.`);
    
    // Se a lib QR Code retornar imagem em base64:
    if (pixData.base64) {
      const media = new MessageMedia('image/png', pixData.base64.split(',')[1], 'pix.png');
      await msg.reply(media);
    }
  } catch (error) {
    console.error('Erro PIX:', error);
    await msg.reply('Tivemos um problema para gerar o PIX automático. A Raquel enviará a chave manualmente.');
  }

  // Salvar pedido no Banco e no Calendar
  const itemsText = session.data.cart.map((i: any) => `${i.quantity}x ${i.type}`).join(', ');
  const orderId = dbService.createOrder(
    session.phoneId, 
    msg._data.notifyName || session.phoneId, 
    session.data.cart, 
    total, 
    deliveryDate.toISOString()
  );

  await googleService.createCalendarEvent(
    msg._data.notifyName || session.phoneId,
    JSON.stringify(session.data.cart),
    total,
    deliveryDate
  );

  // Agendar mensagens
  // 24h antes da entrega:
  const reminderDate = new Date(deliveryDate);
  reminderDate.setDate(reminderDate.getDate() - 1);
  dbService.scheduleMessage(session.phoneId, orderId, 'REMINDER_24H', reminderDate.toISOString());

  // 2 dias após a entrega:
  const feedbackDate = new Date(deliveryDate);
  feedbackDate.setDate(feedbackDate.getDate() + 2);
  dbService.scheduleMessage(session.phoneId, orderId, 'FEEDBACK_2D', feedbackDate.toISOString());

  // Avança status
  session.state = 'AGUARDANDO_COMPROVANTE';
  dbService.setSession(session.phoneId, session.state, session.data);
};
