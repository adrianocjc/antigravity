import { Client, LocalAuth, Message, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { handleIncomingMessage } from '../flow/conversationHandler';

export const whatsappClient = new Client({
  authStrategy: new LocalAuth({ dataPath: './whatsapp-session' }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

whatsappClient.on('qr', (qr) => {
  console.log('QR RECEBIDO. Escaneie-o com o WhatsApp:');
  qrcode.generate(qr, { small: true });
});

whatsappClient.on('ready', () => {
  console.log('Cliente WhatsApp está pronto!');
});

whatsappClient.on('message', async (message: Message) => {
  // Ignorar mensagens de grupos e de si mesmo
  if (message.from.endsWith('@g.us') || message.isStatus || message.from === 'status@broadcast') return;

  try {
    await handleIncomingMessage(message, whatsappClient);
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
    await message.reply('Desculpe, ocorreu um erro interno. Tente novamente mais tarde.');
  }
});

export const initializeWhatsApp = () => {
  whatsappClient.initialize();
};
