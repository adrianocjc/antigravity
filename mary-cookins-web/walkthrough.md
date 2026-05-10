# Walkthrough: Web App da Mary Cookins

O desenvolvimento da página web de vendas de Biscoitos Decorados para a Mary Cookins foi concluído com sucesso. A aplicação possui um design elegante, integração com o fluxo de pedidos (limite de 15 pedidos/semana) e pagamento via PIX.

## Resumo das Entregas

> [!NOTE]
> A aplicação foi construída com **Next.js (App Router)** e **CSS Vanilla**. Não utilizamos TailwindCSS, conforme os requisitos de personalização visual e fomento de uma estética premium com variáveis nativas de CSS.

### 1. Sistema de Design e Identidade Visual
Implementamos as cores baseadas no perfil `@sigamarycookins`:
- **Coral / Rosa Salmão (#E67E7E)** e **Verde Água (#6FB5AF)** para elementos de destaque e botões interativos.
- **Bege (#D9B99B)** e **Off-White (#FDF8F3)** para fundos confortáveis e limpos.
- **Tipografia Premium**: Combinação das fontes do Google `Playfair Display` (para títulos elegantes) e `Inter` (para parágrafos, priorizando a legibilidade).
- **Glassmorphism e Animações**: Foram aplicados efeitos de vidro (desfoque no fundo dos cards de produtos) e animações de fade-in para dar a sensação de um sistema vivo e dinâmico (efeito "WOW").

### 2. Fluxo da Interface do Usuário (`app/page.js`)
O aplicativo atua como uma **Single Page Application (SPA)** de fluxo contínuo em 4 etapas:
1. **Hero & Menu**: Exibição da logomarca (representada pela estética inicial), uma chamada atrativa, e os cards de produtos com fotos (utilizamos uma imagem gerada via IA como base para ilustrar).
2. **Carrinho & Agendamento**: Um resumo do pedido onde o usuário informa Nome, WhatsApp, e escolhe a Data de Entrega através de um calendário simples com verificação de limite.
3. **Pagamento PIX**: Utilização da biblioteca `qrcode.react` para exibir o código QR interativo gerado a partir do valor total do pedido.
4. **Confirmação**: Tela de sucesso informando que a loja entrará em contato via WhatsApp e o agendamento foi finalizado com o Google Agenda.

### 3. Backend e Google Calendar API (`app/api/calendar/route.js`)
> [!IMPORTANT]
> A API foi configurada para interceptar as requisições, calcular a semana correta e bloquear compras que ultrapassem o **limite de 15 pedidos na mesma semana**.

Para que a integração real com a sua conta do Google Agenda funcione em produção, o local exato da inicialização do client (`google.calendar(...)`) foi demarcado com um comentário no arquivo `route.js`. Você precisará configurar as credenciais do **Google Cloud Console** nas variáveis de ambiente na hora do deploy (ex: Vercel).

## Como Executar Localmente

Para rodar o projeto e ver a página ao vivo em sua máquina, abra seu terminal e execute:

```bash
cd mary-cookins-web
npm run dev
```

Em seguida, acesse `http://localhost:3000` em seu navegador.

---
`render_diffs(c:\Users\AdminUser\Desktop\Antigravity\mary-cookins-web\app\page.js)`
`render_diffs(c:\Users\AdminUser\Desktop\Antigravity\mary-cookins-web\app\api\calendar\route.js)`
`render_diffs(c:\Users\AdminUser\Desktop\Antigravity\mary-cookins-web\app\globals.css)`
