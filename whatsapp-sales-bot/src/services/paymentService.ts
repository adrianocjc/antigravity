import dotenv from 'dotenv';
dotenv.config();

// Podemos usar a lib 'pix-payload-generator' para gerar o BRCode
const { QrCodePix } = require('qrcode-pix');

export const paymentService = {
  async generatePixPayload(amount: number): Promise<{ payload: string; base64: string }> {
    const pix = QrCodePix({
      version: '01',
      key: process.env.PIX_KEY || '12345678909', // CPF, CNPJ, Email, Phone
      name: process.env.PIX_NAME || 'Raquel Xavier',
      city: process.env.PIX_CITY || 'Sao Paulo',
      transactionId: process.env.PIX_TXID || 'PEDIDO',
      message: 'Pagamento Pedido',
      cep: '00000000',
      value: amount,
    });

    return {
      payload: pix.payload(),
      base64: await pix.base64()
    };
  }
};
