import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

// Configurações do Google (mock para agora, esperando credenciais reais do usuário)
// O ideal é usar o google.auth.GoogleAuth
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/calendar'],
});

const drive = google.drive({ version: 'v3', auth });
const calendar = google.calendar({ version: 'v3', auth });

export const googleService = {
  async searchDriveImages(theme: string) {
    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      console.warn('Folder ID não configurado');
      return [];
    }

    try {
      const query = `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and name contains '${theme}' and mimeType contains 'image/'`;
      const res = await drive.files.list({
        q: query,
        fields: 'files(id, name, webViewLink, webContentLink)',
        pageSize: 4,
      });
      return res.data.files || [];
    } catch (error) {
      console.error('Erro ao buscar imagens no Drive:', error);
      return [];
    }
  },

  async countEventsInWeek(targetDate: Date) {
    try {
      // Começo da semana da targetDate
      const startOfWeek = new Date(targetDate);
      startOfWeek.setDate(targetDate.getDate() - targetDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      // Fim da semana
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startOfWeek.toISOString(),
        timeMax: endOfWeek.toISOString(),
        singleEvents: true,
      });

      const events = res.data.items || [];
      // Filtra apenas eventos que sejam 'PEDIDO: '
      const orderEvents = events.filter(e => e.summary?.startsWith('PEDIDO:'));
      return orderEvents.length;
    } catch (error) {
      console.error('Erro ao buscar eventos no Calendar:', error);
      return 0; // Assume 0 se falhar para não bloquear, ou trate diferente.
    }
  },

  async createCalendarEvent(customerName: string, itemsDescription: string, totalPrice: number, targetDate: Date) {
    try {
      const event = {
        summary: `PEDIDO: ${customerName}`,
        description: `Itens: ${itemsDescription}\nValor Total: R$ ${totalPrice.toFixed(2)}`,
        start: {
          date: targetDate.toISOString().split('T')[0], // All day event
        },
        end: {
          date: targetDate.toISOString().split('T')[0],
        },
      };

      const res = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
      return res.data;
    } catch (error) {
      console.error('Erro ao criar evento no Calendar:', error);
      return null;
    }
  }
};
