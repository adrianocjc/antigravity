import { whatsappClient, initializeWhatsApp } from './services/whatsappService';
import { startScheduler } from './jobs/scheduler';
import dotenv from 'dotenv';

dotenv.config();

console.log('Iniciando o WhatsApp Sales Bot...');

// Inicializa o agendador passando a instância do cliente para ele poder enviar as mensagens
startScheduler(whatsappClient);

// Inicializa a conexão com o WhatsApp
initializeWhatsApp();
