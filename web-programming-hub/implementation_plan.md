# Plano de Implementação: Hub de Atividades de Programação Web

Este documento descreve o plano para a criação do **Web Dev Hub & Playground**, uma aplicação web premium, moderna e interativa projetada especificamente para professores e estudantes de programação web. O objetivo é duplo: fornecer uma lista estruturada de atividades práticas (com níveis de dificuldade progressivos) e um exemplo completo de site interativo com um editor de código integrado (Sandbox) para testar os exercícios.

---

## 🎨 Conceito e Design Visual

Para causar um impacto visual imediato ("efeito WOW") e demonstrar o que é possível com CSS moderno, o site utilizará:
1. **Design de Vanguarda**: Estilo *Glassmorphic* (efeito de vidro fosco) combinado com um tema escuro e futurista (*Dark Mode*).
2. **Paleta de Cores Premium**: Tons de roxo profundo (`#0d0b21`), violeta néon (`#8b5cf6`), ciano elétrico (`#06b6d4`) e cinzas suaves.
3. **Tipografia Moderna**: Importação da fonte **Outfit** do Google Fonts para um visual limpo e tecnológico.
4. **Interatividade Avançada**: Efeitos hover fluidos, animações suaves de transição (`transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`) e um editor de código integrado que atualiza um iframe em tempo real.

---

## 📋 Lista de Atividades Propostas para os Alunos

O Hub apresentará 4 atividades progressivas:

1. **Atividade 1 (Fácil): Card de Perfil Dinâmico (HTML & CSS)**
   - **Objetivo**: Dominar HTML semântico, flexbox/grid, variáveis CSS, transições e pseudo-classes (`:hover`).
   - **Desafio**: Criar um card de perfil de desenvolvedor com animações suaves ao passar o mouse e suporte básico a modo escuro/claro via CSS.

2. **Atividade 2 (Médio): Gerenciador de Tarefas Interativo (HTML, CSS & JS)**
   - **Objetivo**: Manipulação do DOM, manipulação de eventos em JavaScript e persistência com `localStorage`.
   - **Desafio**: Criar uma lista de tarefas onde os alunos podem adicionar, marcar como concluída, excluir e filtrar tarefas por status (todas, ativas, concluídas), mantendo os dados salvos mesmo após atualizar a página.

3. **Atividade 3 (Avançado): Catálogo de Produtos com Carrinho (HTML, CSS, JS & API)**
   - **Objetivo**: Consumo de APIs (ou dados mockados estruturados em JSON), funções de alta ordem em JS (`filter`, `map`, `reduce`) e animações dinâmicas de interface.
   - **Desafio**: Criar um catálogo de produtos interativo com barra de busca, filtro por categorias e um carrinho de compras funcional que calcula o total e a quantidade em tempo real.

4. **Atividade 4 (Full-stack): Formulário de Feedback com PHP & MySQL**
   - **Objetivo**: Compreender o ciclo de requisição HTTP (Request/Response), validação de dados no Front e Back, conexão com banco de dados relacional (PDO) e prevenção de injeção SQL (Prepared Statements).
   - **Desafio**: Criar um formulário que valida dados via JS, envia para um script PHP, salva os feedbacks em uma tabela MySQL e os exibe de forma segura em um painel administrativo simples.

---

## 🏗️ Estrutura da Aplicação Exemplo (`web-programming-hub`)

Criaremos o projeto em um diretório dedicado no workspace: `c:/Users/AdminUser/Desktop/Antigravity/web-programming-hub`.

```
web-programming-hub/
├── index.html         # Página principal com o Hub, Atividades e Editor Sandbox
├── style.css          # Estilos globais (Glassmorphism, Gradiantes, Layout Responsivo)
├── app.js             # Lógica do painel interativo, renderizador do Sandbox e dados
└── examples/          # Pasta com os arquivos fonte dos exemplos que os alunos podem baixar
    ├── atividade1/    # Exemplo completo do Card de Perfil (index.html, style.css)
    ├── atividade2/    # Exemplo completo do To-Do List (index.html, style.css, app.js)
    ├── atividade3/    # Exemplo completo do Catálogo de Produtos (index.html, style.css, app.js)
    └── atividade4/    # Exemplo completo Full-stack PHP + MySQL
        ├── config.php # Conexão com banco de dados usando PDO
        ├── index.php  # Formulário HTML + listagem de feedbacks
        ├── salvar.php # Script PHP de processamento e inserção segura
        └── schema.sql # Script SQL para criação da tabela
```

---

## 💻 Recursos Especiais do Site Exemplo (Hub)

- **Sandbox de Código Interativo**: Uma área da página onde o aluno/professor pode modificar o HTML, CSS e JavaScript e ver o resultado renderizado instantaneamente em um iframe.
- **Visualizador de Código Fonte**: Abas organizadas para visualizar os códigos completos de cada atividade com realce de sintaxe elegante.
- **Seção de Download das Atividades**: Instruções estruturadas e passo a passo em formato de PDF/Guia digital interativo direto no site.

---

## 🛠️ Plano de Verificação

### Testes Manuais
- Abrir a aplicação em múltiplos navegadores para validar a renderização do Glassmorphism.
- Testar a responsividade em tamanhos de tela mobile, tablet e desktop.
- Validar a funcionalidade da Sandbox digitando tags HTML, aplicando estilos CSS e rodando um script JS simples (`console.log` / `alert`) para garantir a correta injeção e execução no iframe.
- Verificar se as explicações e códigos fornecidos na Atividade 4 (PHP/MySQL) seguem as melhores práticas modernas de segurança (uso de PDO, tratamento de erros, sanitização de entrada com `htmlspecialchars`).

---

## 🗣️ Aguardando Feedback do Usuário

> [!IMPORTANT]
> **Por favor, avalie a proposta e informe:**
> 1. Você deseja que eu crie a estrutura de diretórios e arquivos exatamente como planejada?
> 2. O editor Sandbox interativo integrado na própria página é interessante para os seus alunos testarem o código diretamente?
> 3. Deseja fazer alguma alteração nos tópicos ou complexidade das atividades propostas?
