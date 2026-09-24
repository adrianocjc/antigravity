# 🥗 Cardápio Escolar & Portal de Necessidades Alimentares (NutriEscolar)

Sistema web completo, moderno e acessível para consulta diária do cardápio escolar, avaliação nutricional pelos estudantes e servidores, **portal privado com login/senha para cadastro de necessidades e restrições alimentares**, e **painel administrativo para a Gestão e Coordenação Escolar**.

---

## 🌟 Novas Funcionalidades Implementadas

### 🔐 1. Portal do Aluno & Servidor (Área Privada)
- **Login e Senha Individuais:** Cada aluno, professor ou funcionário possui sua própria conta.
- **Cadastro de Necessidades Alimentares Privadas:** O usuário pode declarar suas restrições de forma segura e reservada:
  - 🥛 **Intolerância a Lactose**
  - 🌾 **Doença Celíaca / Restrição a Glúten**
  - 🌱 **Dieta Vegetariana**
  - 🌿 **Dieta Vegana**
  - 🍬 **Diabetes / Restrição de Açúcar**
  - 🥜 **Alergia a Amendoim & Oleaginosas** *(Alertas de anafilaxia)*
  - 🦐 **Alergia a Frutos do Mar & Peixes**
  - 🥚 **Alergia a Ovos**
  - 🩸 **Alergia a Corantes & Conservantes**
  - 📝 **Outras Alergias e Observações Médicas Especiais**
  - 📞 **Contato de Emergência dos Responsáveis**

### 🛡️ 2. Painel da Gestão & Coordenação Escolar (Acesso Admin)
- Protegido por autenticação/senha de Administrador (`admin123`).
- **Relatório Completo de Alergias:** Visualização unificada de todos os alunos e servidores cadastrados.
- **Filtros Inteligentes:** Pesquisa instantânea por nome, e-mail, turma/série (ex: 8º Ano A) e por tipo de restrição.
- **Alerta de Riscos da Cozinha:** Destaque especial em vermelho para alergias graves (amendoim, celíacos e choque anafilático).
- **Ficha Alimentar Completa:** Exibição em modal com contatos de emergência e histórico de saúde.
- **Impressão para a Cozinha & Nutricionista:** Botão de impressão formatada em PDF/Papel para consulta da equipe da merenda.

---

## 🔑 Credenciais para Teste Rápido (Demonstração)

Você pode testar o sistema instantaneamente usando os botões de **Acesso Rápido** no site ou digitando as contas abaixo:

| Perfil | E-mail | Senha | Descrição de Teste |
| :--- | :--- | :--- | :--- |
| **Aluno** | `aluno@escola.edu` | `123456` | Lucas Silva (Intolerante a Lactose) |
| **Aluna** | `mariana@escola.edu` | `123456` | Mariana Oliveira (Celíaca & Alergia Amendoim) |
| **Professora** | `professor@escola.edu` | `123456` | Profª Ana (Vegana & Diabética) |
| **Funcionário** | `roberto@escola.edu` | `123456` | Roberto Santos (Alergia a Frutos do Mar/Ovo) |
| **Gestão / Admin** | `admin@escola.edu` | `admin123` | Coordenadora Maria (Acesso Total à Coordenação) |

---

## 🛠️ Como Executar o Servidor Node.js + SQLite (Opcional)

O sistema funciona **tanto em modo estático (abrir index.html diretamente)** quanto via **Servidor Node.js + SQLite**:

1. **Instalar Dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o Servidor:**
   ```bash
   npm start
   ```

3. **Acessar no Navegador:**
   Navegue para `http://localhost:3000`

---

## 💾 Banco de Dados SQL (`database.sql`)

O projeto inclui o arquivo [`database.sql`](file:///c:/Users/AdminUser/Desktop/Antigravity/cardapio-escolar/database.sql) com as tabelas ANSI SQL:
- `usuarios` (Contas de Alunos, Professores, Servidores e Admin)
- `necessidades_alimentares` (Restrições, Alergias e Fichas de Saúde)
- `pratos` (Alimentos, Nutrientes e Selos Alergênicos)
- `cardapio_semanal` (Refeições do dia e da semana)
- `avaliacoes` (Notas, Estrelas e Comentários)

---

## 📄 Licença
Desenvolvido para escolas públicas e privadas • NutriEscolar 2026.
