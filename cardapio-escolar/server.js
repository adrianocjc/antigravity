/* ============================================================
   CARDÁPIO ESCOLAR - SERVIDOR NODE.JS (Express + SQLite)
   Portal do Aluno/Servidor, Avaliação & Gestão de Restrições Alimentares
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
        // Tabela de Usuários
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                tipo_usuario TEXT NOT NULL DEFAULT 'Aluno',
                turma_setor TEXT,
                criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabela de Necessidades Alimentares
        db.run(`
            CREATE TABLE IF NOT EXISTS necessidades_alimentares (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL UNIQUE,
                intolerancia_lactose INTEGER DEFAULT 0,
                restricao_gluten INTEGER DEFAULT 0,
                vegetariano INTEGER DEFAULT 0,
                vegano INTEGER DEFAULT 0,
                diabetes INTEGER DEFAULT 0,
                alergia_amendoim INTEGER DEFAULT 0,
                alergia_frutos_mar INTEGER DEFAULT 0,
                alergia_ovo INTEGER DEFAULT 0,
                alergia_corantes INTEGER DEFAULT 0,
                outras_alergias TEXT,
                observacoes_medicas TEXT,
                contato_emergencia TEXT,
                atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);

        // Tabela de Pratos
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

        // Tabela de Avaliações
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

        // Popular dados iniciais de teste se a tabela usuarios estiver vazia
        db.get(`SELECT COUNT(*) AS total FROM usuarios`, [], (err, row) => {
            if (!err && row && row.total === 0) {
                console.log('🌱 Semeando dados iniciais no SQLite...');
                db.run(`INSERT INTO usuarios (id, nome, email, senha, tipo_usuario, turma_setor) VALUES
                    (1, 'Lucas Silva', 'aluno@escola.edu', '123456', 'Aluno', '8º Ano A'),
                    (2, 'Mariana Oliveira', 'mariana@escola.edu', '123456', 'Aluno', '9º Ano B'),
                    (3, 'Profª Ana Costa', 'professor@escola.edu', '123456', 'Professor', 'Corpo Docente - Biologia'),
                    (4, 'Roberto Santos', 'roberto@escola.edu', '123456', 'Funcionário', 'Secretaria Escolar'),
                    (5, 'Coordenadora Maria', 'admin@escola.edu', 'admin123', 'Admin', 'Gestão & Coordenação')`);

                db.run(`INSERT INTO necessidades_alimentares (usuario_id, intolerancia_lactose, restricao_gluten, vegetariano, vegano, diabetes, alergia_amendoim, alergia_frutos_mar, alergia_ovo, alergia_corantes, outras_alergias, observacoes_medicas, contato_emergencia) VALUES
                    (1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 'Nenhuma', 'Intolerância moderada a lactose.', 'Mãe: (84) 99888-1122'),
                    (2, 0, 1, 1, 0, 0, 1, 0, 0, 0, 'Alergia grave a Amendoim', 'Diagnóstico de Celíaca. Risco de contaminação cruzada.', 'Pai: (84) 98777-3344'),
                    (3, 0, 0, 0, 1, 1, 0, 0, 0, 0, 'Nenhuma', 'Dieta estritamente vegana e controle de glicemia (Diabetes Tipo 2).', 'Esposo: (84) 99111-5566'),
                    (4, 1, 0, 0, 0, 0, 0, 1, 1, 0, 'Camarão e frutos do mar', 'Reação alérgica moderada a frutos do mar e ovo.', 'Esposa: (84) 98822-7788')`);
            }
        });

        console.log('✅ Tabelas SQL verificadas/criadas no SQLite.');
    });
}

// ------------------------------------------------------------
// ROTAS DA API REST (ENDPOINTS SQL)
// ------------------------------------------------------------

// 1. Auth: Registro de Usuário
app.post('/api/auth/register', (req, res) => {
    const { nome, email, senha, tipo_usuario, turma_setor } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Preencha nome, e-mail e senha.' });
    }

    const sql = `INSERT INTO usuarios (nome, email, senha, tipo_usuario, turma_setor) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [nome, email.toLowerCase().trim(), senha, tipo_usuario || 'Aluno', turma_setor || ''], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'Este e-mail já está cadastrado no sistema.' });
            }
            return res.status(500).json({ error: err.message });
        }
        
        const userId = this.lastID;
        // Cria registro inicial de necessidades em branco
        db.run(`INSERT OR IGNORE INTO necessidades_alimentares (usuario_id) VALUES (?)`, [userId]);

        res.json({
            message: 'Cadastro realizado com sucesso!',
            user: { id: userId, nome, email: email.toLowerCase().trim(), tipo_usuario: tipo_usuario || 'Aluno', turma_setor }
        });
    });
});

// 2. Auth: Login de Usuário
app.post('/api/auth/login', (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    const sql = `SELECT id, nome, email, tipo_usuario, turma_setor FROM usuarios WHERE LOWER(email) = LOWER(?) AND senha = ?`;
    db.get(sql, [email.trim(), senha], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: 'E-mail ou senha incorretos.' });

        res.json({ message: 'Login efetuado com sucesso!', user: row });
    });
});

// 3. Obter Necessidades Alimentares do Usuário Logado
app.get('/api/necessidades/:usuario_id', (req, res) => {
    const userId = req.params.usuario_id;
    const sql = `SELECT * FROM necessidades_alimentares WHERE usuario_id = ?`;
    db.get(sql, [userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) {
            return res.json({
                usuario_id: parseInt(userId),
                intolerancia_lactose: 0,
                restricao_gluten: 0,
                vegetariano: 0,
                vegano: 0,
                diabetes: 0,
                alergia_amendoim: 0,
                alergia_frutos_mar: 0,
                alergia_ovo: 0,
                alergia_corantes: 0,
                outras_alergias: '',
                observacoes_medicas: '',
                contato_emergencia: ''
            });
        }
        res.json(row);
    });
});

// 4. Salvar/Atualizar Necessidades Alimentares
app.post('/api/necessidades/:usuario_id', (req, res) => {
    const userId = req.params.usuario_id;
    const {
        intolerancia_lactose, restricao_gluten, vegetariano, vegano,
        diabetes, alergia_amendoim, alergia_frutos_mar, alergia_ovo,
        alergia_corantes, outras_alergias, observacoes_medicas, contato_emergencia
    } = req.body;

    const sql = `
        INSERT INTO necessidades_alimentares (
            usuario_id, intolerancia_lactose, restricao_gluten, vegetariano, vegano,
            diabetes, alergia_amendoim, alergia_frutos_mar, alergia_ovo,
            alergia_corantes, outras_alergias, observacoes_medicas, contato_emergencia, atualizado_em
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(usuario_id) DO UPDATE SET
            intolerancia_lactose=excluded.intolerancia_lactose,
            restricao_gluten=excluded.restricao_gluten,
            vegetariano=excluded.vegetariano,
            vegano=excluded.vegano,
            diabetes=excluded.diabetes,
            alergia_amendoim=excluded.alergia_amendoim,
            alergia_frutos_mar=excluded.alergia_frutos_mar,
            alergia_ovo=excluded.alergia_ovo,
            alergia_corantes=excluded.alergia_corantes,
            outras_alergias=excluded.outras_alergias,
            observacoes_medicas=excluded.observacoes_medicas,
            contato_emergencia=excluded.contato_emergencia,
            atualizado_em=CURRENT_TIMESTAMP
    `;

    const params = [
        userId,
        intolerancia_lactose ? 1 : 0,
        restricao_gluten ? 1 : 0,
        vegetariano ? 1 : 0,
        vegano ? 1 : 0,
        diabetes ? 1 : 0,
        alergia_amendoim ? 1 : 0,
        alergia_frutos_mar ? 1 : 0,
        alergia_ovo ? 1 : 0,
        alergia_corantes ? 1 : 0,
        outras_alergias || '',
        observacoes_medicas || '',
        contato_emergencia || ''
    ];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Necessidades alimentares salvas com sucesso!' });
    });
});

// 5. Painel Admin: Listar todas as necessidades de alunos e servidores
app.get('/api/admin/necessidades', (req, res) => {
    const sql = `
        SELECT u.id AS usuario_id, u.nome, u.email, u.tipo_usuario, u.turma_setor,
               n.intolerancia_lactose, n.restricao_gluten, n.vegetariano, n.vegano,
               n.diabetes, n.alergia_amendoim, n.alergia_frutos_mar, n.alergia_ovo,
               n.alergia_corantes, n.outras_alergias, n.observacoes_medicas, n.contato_emergencia,
               n.atualizado_em
        FROM usuarios u
        LEFT JOIN necessidades_alimentares n ON u.id = n.usuario_id
        ORDER BY u.tipo_usuario ASC, u.nome ASC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 6. Rota: Listar todos os pratos
app.get('/api/pratos', (req, res) => {
    db.all(`SELECT * FROM pratos`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 7. Rota: Salvar nova avaliação no Banco de Dados SQL
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

// 8. Rota: Obter relatório de estatísticas
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
