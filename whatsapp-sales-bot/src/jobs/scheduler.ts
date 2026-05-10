import cron from 'node-cron';
import { dbService } from '../services/databaseService';
import { Client } from 'whatsapp-web.js';

export const startScheduler = (client: Client) => {
  // Roda de hora em hora
  cron.schedule('0 * * * *', async () => {
    console.log('Executando cron de mensagens agendadas...');
    const now = new Date().toISOString();
    
    const pendingMessages = dbService.getPendingScheduledMessages(now);
    
    for (const msg of pendingMessages) {
      try {
        let text = '';
        if (msg.messageType === 'REMINDER_24H') {
          text = 'Olá! Passando para lembrar que sua encomenda (Biscoitos/Macarons da Raquel) está agendada para amanhã! 🍪💖 Qualquer dúvida, estamos à disposição.';
        } else if (msg.messageType === 'FEEDBACK_2D') {
          text = 'Olá! Há dois dias você recebeu nossos doces. Queríamos saber: o que você achou? Seu feedback é muito importante para nós! 🥰';
        }

        if (text) {
          await client.sendMessage(msg.phoneId, text);
          dbService.markMessageAsSent(msg.id);
          console.log(`Mensagem agendada (${msg.messageType}) enviada para ${msg.phoneId}`);
        }
      } catch (error) {
        console.error(`Erro ao enviar mensagem agendada para ${msg.phoneId}:`, error);
      }
    }
  });
};
