/* ============================================================
   CARDÁPIO ESCOLAR - SERVIDOR OPCIONAL (Node.js + Express + SQLite)
   Tecnologias 100% Simples e Gratuitas
   ============================================================ */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON e arquivos estáticos (HTML/CSS/JS)
app.use(express.json());
app.use(express.static(__dirname));

// Conexão com o Banco de Dados SQLite (Cria o arquivo escoladb.sqlite se não existir)
const db = new sqlite3.Database('./escoladb.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite com sucesso!');
        inicializarTabelas();
    }
});

// Inicialização e Criação de Tabelas SQL
function inicializarTabelas() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS pratos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                categoria TEXT NOT NULL,
                descricao TEXT,
                calorias INTEGER DEFAULT 0,
                proteinas_g REAL DEFAULT 0,
                eh_vegetariano INTEGER DEFAULT 0
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS avaliacoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prato_id INTEGER,
                nota INTEGER CHECK(nota BETWEEN 1 AND 5),
                categoria_feedback TEXT,
                comentario TEXT,
                tipo_usuario TEXT DEFAULT 'Aluno',
                data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Tabelas SQL verificadas/criadas no SQLite.');
    });
}

// ------------------------------------------------------------
// ROTAS DA API REST (ENDPOINTS SQL)
// ------------------------------------------------------------

// 1. Rota: Listar todos os pratos
app.get('/api/pratos', (req, res) => {
    db.all(`SELECT * FROM pratos`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. Rota: Salvar nova avaliação no Banco de Dados SQL
app.post('/api/avaliacoes', (req, res) => {
    const { prato_id, nota, categoria_feedback, comentario, tipo_usuario } = req.body;

    const sql = `INSERT INTO avaliacoes (prato_id, nota, categoria_feedback, comentario, tipo_usuario) 
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [prato_id, nota, categoria_feedback, comentario, tipo_usuario];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Avaliação salva com sucesso!', id: this.lastID });
    });
});

// 3. Rota: Obter relatório de estatísticas (Média de notas por prato)
app.get('/api/estatisticas', (req, res) => {
    const sql = `
        SELECT p.nome, p.categoria, ROUND(AVG(a.nota), 2) AS media_nota, COUNT(a.id) AS total_votos
        FROM avaliacoes a
        JOIN pratos p ON a.prato_id = p.id
        GROUP BY p.id
        ORDER BY media_nota DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Rota principal para servir o index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor HTTP
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`Abra o navegador para testar o site.`);
});
