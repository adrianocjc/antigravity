# Walkthrough: Web Dev Hub & Playground

Este documento serve como um guia explicativo e manual de utilização do **Web Dev Hub & Playground**, um ecossistema educacional completo projetado para ensinar desenvolvimento web de forma moderna, visual e interativa.

---

## 📂 Estrutura do Projeto Gerado

O projeto foi organizado com o máximo de capricho e rigor técnico no seu workspace em `web-programming-hub/`:

```
web-programming-hub/
├── index.html         # Painel principal do Hub com a Área do Professor/Aluno
├── style.css          # Estilos de vanguarda (Glassmorphism, Neon Glow, Dark Theme)
├── app.js             # Lógica de controle de abas, visualização de arquivos e editor Sandbox
└── examples/          # Pasta contendo os códigos-fonte puros e isolados para distribuição
    ├── atividade1/    # Atividade 1: Card de Perfil (HTML & CSS)
    │   ├── index.html
    │   └── style.css
    ├── atividade2/    # Atividade 2: Gerenciador de Tarefas (HTML, CSS & JS)
    │   ├── index.html
    │   ├── style.css
    │   └── app.js
    ├── atividade3/    # Atividade 3: Vitrine Virtual (HTML, CSS & JS)
    │   ├── index.html
    │   ├── style.css
    │   └── app.js
    └── atividade4/    # Atividade 4: Integração de Formulário (PHP & MySQL)
        ├── schema.sql # Script SQL para criar banco e tabela no phpMyAdmin
        ├── config.php # Conexão relacional segura usando PHP PDO
        ├── index.php  # Formulário HTML de entrada e listagem de registros
        └── salvar.php # Script de salvamento seguro (combate a SQL Injection)
```

---

## 🎨 Destaques do Design Premium (Efeito "WOW")

- **Interface Glassmorphic**: Utilização de fundos semi-transparentes (`rgba(255, 255, 255, 0.03)`) com bordas delicadas e efeito de desfoque de fundo (`backdrop-filter: blur()`).
- **Tema Escuro Futurista**: Cores HSL balanceadas, pretos azulados profundos e realces em ciano e violeta néon.
- **Tipografia Moderna**: Importação direta da fonte Google Fonts **Outfit** para uma leitura limpa, elegante e profissional.
- **Live Sandbox Playground**: Uma área interativa integrada dividida em duas colunas. O estudante escreve o código nas abas do editor (HTML, CSS e JS) e a renderização acontece dinamicamente e em tempo real em um iframe lateral!

---

## 🚀 Como Executar o Hub e o Sandbox

1. **Abra o arquivo principal**:
   - Navegue até a pasta `web-programming-hub/`.
   - Clique duas vezes no arquivo `index.html` para abri-lo diretamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).
   
2. **Navegue pelas Atividades**:
   - Utilize a barra lateral esquerda para transitar entre a página inicial, as quatro atividades práticas e a Sandbox.
   
3. **Explore e copie os códigos**:
   - Em cada atividade, você verá abas para os arquivos correspondentes (HTML, CSS, JS, etc.).
   - Clique em **"Copiar Código"** para salvar o bloco completo na sua área de transferência com feedback visual instantâneo!

4. **Experimente no Sandbox**:
   - Em qualquer uma das atividades client-side (1, 2 ou 3), clique no botão roxo **"Testar no Sandbox"** no topo superior direito da atividade.
   - O painel carregará o código-modelo completo diretamente na Sandbox e executará a renderização instantaneamente! Você pode modificar as tags, cores e scripts para ver os efeitos na hora.

---

## 🐘 Como Configurar e Executar a Atividade 4 (PHP & MySQL)

Para executar o exemplo full-stack conectado ao banco de dados relacional, siga os passos abaixo:

### Passo 1: Preparação do Servidor Local
1. Certifique-se de ter um ambiente de servidor local Apache + PHP + MySQL instalado, como o **XAMPP** ou **Laragon**.
2. Abra o painel de controle do XAMPP e ative os módulos **Apache** e **MySQL** clicando em "Start".

### Passo 2: Copiar os Arquivos
1. Copie a pasta inteira `web-programming-hub/examples/atividade4` para o diretório raiz de arquivos públicos do seu servidor local:
   - No **XAMPP (Windows)**: Geralmente localizado em `C:\xampp\htdocs\`.
   - No **Laragon**: Geralmente em `C:\laragon\www\`.

### Passo 3: Criar o Banco de Dados
1. No seu navegador, acesse o painel administrativo do banco de dados: [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
2. Clique na aba **"SQL"** no topo.
3. Abra o arquivo `schema.sql` (localizado em `atividade4/schema.sql`), copie todo o seu conteúdo, cole na caixa de texto do phpMyAdmin e clique no botão **"Executar"** (Go).
4. O banco `academia_feedback` e a tabela `feedbacks` serão gerados instantaneamente.

### Passo 4: Executar a Aplicação no Navegador
1. No navegador, acesse o endereço correspondente:
   - Se colocou na pasta raiz, digite: [http://localhost/atividade4/index.php](http://localhost/atividade4/index.php).
2. Preencha o nome, e-mail e mensagem no formulário esquerdo e envie.
3. Os feedbacks serão salvos com segurança no MySQL e exibidos em ordem cronológica reversa (do mais novo ao mais antigo) no painel do lado direito!

### 🛡️ Práticas de Segurança Ensinadas aos Alunos neste Exemplo:
- **Proteção contra SQL Injection**: Uso do framework PDO com **Prepared Statements** (parâmetros nomeados `:nome`, `:email`, `:mensagem`) em `salvar.php`. Isso anula qualquer tentativa de injeção de comandos SQL maliciosos através do formulário.
- **Proteção contra Cross-Site Scripting (XSS)**: Uso da função `htmlspecialchars()` ao exibir os dados cadastrados no HTML de listagem em `index.php`. Isso impede que códigos JavaScript inseridos maliciosamente nos campos do formulário sejam executados no navegador dos usuários ao carregar a página.
