# 🥗 NutriEscolar - Consulta e Avaliação do Cardápio Escolar

Sistema web completo, moderno e responsivo desenvolvido com **HTML5, CSS3, JavaScript e SQL** para consulta diária do cardápio escolar e avaliação nutricional com feedback em tempo real pela comunidade escolar (alunos, professores, funcionários e responsáveis).

---

## 🌟 Recursos do Sistema

1. **📅 Consulta do Cardápio Semanal**:
   - Visualização por dia da semana (Segunda a Sexta).
   - Informações nutricionais completas (Calorias e Proteínas).
   - Selos de restrição alimentar (🌱 Vegetariano, 🌾 Sem Glúten, 🥛 Sem Lactose).
   - Média atual de estrelas de cada prato.

2. **⭐ Sistema de Avaliação com Estrelas**:
   - Classificação interativa de 1 a 5 estrelas.
   - Categorias de destaque (😋 Sabor, 🌡️ Temperatura, 🎨 Apresentação, 🍽️ Porção, 🥗 Variedade).
   - Identificação do perfil do usuário (Aluno, Professor, Funcionário, Responsável) e Turma.
   - Campo para comentários e sugestões de melhoria.

3. **📊 Painel de Estatísticas e Satisfação**:
   - Média geral de aceitação da merenda.
   - Ranking do prato campeão de notas.
   - Feedbacks recentes exibidos em tempo real.

4. **💾 Console SQL & Banco de Dados**:
   - Editor de SQL interativo onde é possível testar queries reais (`SELECT`, `GROUP BY`, `JOIN`).
   - Consultas pré-programadas para análise rápida de dados.
   - Download do arquivo `database.sql` pré-configurado.

5. **🌙 Modo Escuro / Claro (Dark & Light Theme)**:
   - Suporte completo a tema escuro ajustável com um clique e memória de preferência.

---

## 📂 Estrutura de Arquivos

```text
cardapio-escolar/
├── index.html        # Estrutura semântica e interface do site
├── styles.css        # Sistema de design, cores, animações e responsividade
├── app.js            # Lógica interativa, banco de dados local e motor SQL
├── database.sql      # Script de banco de dados SQL completo (ANSI/SQLite/MySQL)
├── server.js        # Servidor opcional em Node.js com SQLite para REST API
└── README.md         # Documentação e instruções de uso
```

---

## 🚀 Como Executar o Projeto

### Opção 1: Diretamente no Navegador (Mais Simples - Sem Instalação)
1. Baixe a pasta `cardapio-escolar`.
2. Dê um duplo clique no arquivo `index.html`.
3. O site abrirá no seu navegador padrão (Chrome, Edge, Firefox, Safari) com todas as funcionalidades operando imediatamente!

---

### Opção 2: Com Servidor Node.js + SQLite (Opcional para Backend)
Caso deseje rodar com um servidor Node.js e banco SQLite real em arquivo:

1. Abra o terminal na pasta do projeto:
```bash
cd cardapio-escolar
```

2. Instale as dependências leves:
```bash
npm init -y
npm install express sqlite3
```

3. Inicie o servidor:
```bash
node server.js
```

4. Acesse no seu navegador: `http://localhost:3000`

---

## 💾 Estrutura do Banco de Dados SQL (`database.sql`)

### Tabela `pratos`
Almacena os itens alimentares servidos:
```sql
CREATE TABLE pratos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descricao TEXT,
    calorias INT DEFAULT 0,
    proteinas_g DECIMAL(5,1) DEFAULT 0.0,
    contem_gluten BOOLEAN DEFAULT FALSE,
    contem_lactose BOOLEAN DEFAULT FALSE,
    eh_vegetariano BOOLEAN DEFAULT FALSE
);
```

### Tabela `avaliacoes`
Registra os votos e opiniões da merenda:
```sql
CREATE TABLE avaliacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cardapio_id INT NOT NULL,
    prato_id INT,
    nota INT CHECK(nota BETWEEN 1 AND 5),
    categoria_feedback VARCHAR(50),
    comentario TEXT,
    tipo_usuario VARCHAR(30) DEFAULT 'Aluno',
    data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🌐 Ferramentas Gratuitas para Hospedar Online

- **GitHub Pages**: Hospedagem estática gratuita de alta velocidade.
- **Netlify / Vercel**: Faça upload da pasta ou conecte ao GitHub com deploy automático em segundos.
- **Render.com / Railway**: Para hospedar o backend Node.js + SQLite sem custos.

---

### 💚 Licença
Projeto livre e educacional. Sinta-se à vontade para utilizar na sua escola ou projeto de estudos!
