-- ============================================================
-- BANCO DE DADOS: CARDÁPIO ESCOLAR E SISTEMA DE AVALIAÇÃO
-- PORTAL DO ALUNO/SERVIDOR E NECESSIDADES ALIMENTARES
-- Compatível com: SQLite, MySQL, PostgreSQL
-- ============================================================

-- 1. TABELA DE USUÁRIOS (Alunos, Professores, Servidores, Admin)
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    tipo_usuario VARCHAR(30) NOT NULL DEFAULT 'Aluno', -- 'Aluno', 'Professor', 'Funcionário', 'Responsável', 'Admin'
    turma_setor VARCHAR(50), -- Ex: '8º Ano A', 'Corpo Docente', 'Secretaria'
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE NECESSIDADES E RESTRIÇÕES ALIMENTARES
CREATE TABLE IF NOT EXISTS necessidades_alimentares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL UNIQUE,
    intolerancia_lactose BOOLEAN DEFAULT FALSE,
    restricao_gluten BOOLEAN DEFAULT FALSE,
    vegetariano BOOLEAN DEFAULT FALSE,
    vegano BOOLEAN DEFAULT FALSE,
    diabetes BOOLEAN DEFAULT FALSE,
    alergia_amendoim BOOLEAN DEFAULT FALSE,
    alergia_frutos_mar BOOLEAN DEFAULT FALSE,
    alergia_ovo BOOLEAN DEFAULT FALSE,
    alergia_corantes BOOLEAN DEFAULT FALSE,
    outras_alergias TEXT,
    observacoes_medicas TEXT,
    contato_emergencia VARCHAR(100),
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. TABELA DE PRATOS / ALIMENTOS
CREATE TABLE IF NOT EXISTS pratos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL, -- 'Principal', 'Acompanhamento', 'Salada', 'Sobremesa', 'Bebida'
    descricao TEXT,
    calorias INT DEFAULT 0,
    proteinas_g DECIMAL(5,1) DEFAULT 0.0,
    contem_gluten BOOLEAN DEFAULT FALSE,
    contem_lactose BOOLEAN DEFAULT FALSE,
    eh_vegetariano BOOLEAN DEFAULT FALSE,
    imagem_url TEXT
);

-- 4. TABELA DE CARDÁPIO DIÁRIO / SEMANAL
CREATE TABLE IF NOT EXISTS cardapio_semanal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dia_semana VARCHAR(20) NOT NULL, -- 'Segunda-feira', 'Terça-feira', etc.
    data_servida DATE NOT NULL,
    turno VARCHAR(20) NOT NULL DEFAULT 'Almoço', -- 'Lanche Manhã', 'Almoço', 'Lanche Tarde'
    prato_principal_id INT,
    acompanhamento_id INT,
    salada_id INT,
    sobremesa_id INT,
    bebida_id INT,
    FOREIGN KEY (prato_principal_id) REFERENCES pratos(id),
    FOREIGN KEY (acompanhamento_id) REFERENCES pratos(id),
    FOREIGN KEY (salada_id) REFERENCES pratos(id),
    FOREIGN KEY (sobremesa_id) REFERENCES pratos(id),
    FOREIGN KEY (bebida_id) REFERENCES pratos(id)
);

-- 5. TABELA DE AVALIAÇÕES E FEEDBACKS
CREATE TABLE IF NOT EXISTS avaliacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cardapio_id INT NOT NULL,
    prato_id INT,
    nota INT CHECK(nota BETWEEN 1 AND 5),
    categoria_feedback VARCHAR(50),
    comentario TEXT,
    tipo_usuario VARCHAR(30) DEFAULT 'Aluno',
    serie_turma VARCHAR(30),
    data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cardapio_id) REFERENCES cardapio_semanal(id)
);

-- 6. TABELA DE SUGESTÕES DA COMUNIDADE ESCOLAR
CREATE TABLE IF NOT EXISTS sugestoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_usuario VARCHAR(100) DEFAULT 'Anônimo',
    tipo_usuario VARCHAR(30) DEFAULT 'Aluno',
    mensagem TEXT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- DADOS INICIAIS DE EXEMPLO (SEED DATA)
-- ============================================================

-- Inserindo Usuários de Teste (Senhas em texto simples para fins demonstrativos escolares)
INSERT INTO usuarios (id, nome, email, senha, tipo_usuario, turma_setor) VALUES
(1, 'Lucas Silva', 'aluno@escola.edu', '123456', 'Aluno', '8º Ano A'),
(2, 'Mariana Oliveira', 'mariana@escola.edu', '123456', 'Aluno', '9º Ano B'),
(3, 'Profª Ana Costa', 'professor@escola.edu', '123456', 'Professor', 'Corpo Docente - Biologia'),
(4, 'Roberto Santos', 'roberto@escola.edu', '123456', 'Funcionário', 'Secretaria Escolar'),
(5, 'Coordenadora Maria', 'admin@escola.edu', 'admin123', 'Admin', 'Gestão & Coordenação');

-- Inserindo Necessidades Alimentares dos Usuários
INSERT INTO necessidades_alimentares (usuario_id, intolerancia_lactose, restricao_gluten, vegetariano, vegano, diabetes, alergia_amendoim, alergia_frutos_mar, alergia_ovo, alergia_corantes, outras_alergias, observacoes_medicas, contato_emergencia) VALUES
(1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 'Nenhuma', 'Intolerância moderada a lactose. Evitar leite puro e queijos amarronzados.', 'Mãe: (84) 99888-1122'),
(2, 0, 1, 1, 0, 0, 1, 0, 0, 0, 'Alergia grave a Amendoim', 'Diagnóstico de Doença Celíaca. Atenção total à contaminação cruzada de glúten e amendoim.', 'Pai: (84) 98777-3344'),
(3, 0, 0, 0, 1, 1, 0, 0, 0, 0, 'Nenhuma', 'Dieta estritamente vegana e controle de glicemia (Diabetes Tipo 2).', 'Esposo: (84) 99111-5566'),
(4, 1, 0, 0, 0, 0, 0, 1, 1, 0, 'Camarão e frutos do mar', 'Reação alérgica moderada a frutos do mar e ovo.', 'Esposa: (84) 98822-7788');

-- Inserindo Pratos
INSERT INTO pratos (id, nome, categoria, descricao, calorias, proteinas_g, contem_gluten, contem_lactose, eh_vegetariano, imagem_url) VALUES
(1, 'Arroz Integral com Feijão Carioca', 'Acompanhamento', 'Arroz soltinho rico em fibras e feijão temperado com alho e louro.', 240, 8.5, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'),
(2, 'Strogonoff de Frango Leve', 'Principal', 'Peito de frango em cubos com molho caseiro de tomate e iogurte natural.', 310, 26.0, FALSE, TRUE, FALSE, 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=400&q=80'),
(3, 'Feijoada Vegetariana', 'Principal', 'Feijão preto com abóbora, cenoura, tofu defumado e couve fatiada.', 280, 14.0, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'),
(4, 'Carne Moída com Batata', 'Principal', 'Patinho moído refogado com batatas em cubos e cheiro-verde.', 290, 24.5, FALSE, FALSE, FALSE, 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=400&q=80'),
(5, 'Salada Colorida de Vagem e Cenoura', 'Salada', 'Cenoura ralada, vagem cozida no vapor, tomate cereja e azeite.', 65, 1.8, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80'),
(6, 'Salada Tropical de Alface e Manga', 'Salada', 'Mix de alface crespa, mangas em cubos e sementes de girassol.', 75, 1.2, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'),
(7, 'Banana Caturra Natural', 'Sobremesa', 'Banana fresca rica em potássio.', 90, 1.1, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80'),
(8, 'Melancia Fatiada', 'Sobremesa', 'Fatia suculenta de melancia geladinha.', 60, 0.9, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=400&q=80'),
(9, 'Suco Natural de Laranja', 'Bebida', 'Suco 100% natural sem adição de açúcar.', 110, 1.5, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80'),
(10, 'Suco de Maracujá com Hortelã', 'Bebida', 'Suco refrescante de maracujá adoçado levemente.', 85, 0.8, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80');

-- Inserindo Cardápios da Semana
INSERT INTO cardapio_semanal (id, dia_semana, data_servida, turno, prato_principal_id, acompanhamento_id, salada_id, sobremesa_id, bebida_id) VALUES
(1, 'Segunda-feira', '2026-09-21', 'Almoço', 2, 1, 5, 7, 9),
(2, 'Terça-feira', '2026-09-22', 'Almoço', 4, 1, 6, 8, 10),
(3, 'Quarta-feira', '2026-09-23', 'Almoço', 3, 1, 5, 7, 9),
(4, 'Quinta-feira', '2026-09-24', 'Almoço', 2, 1, 6, 8, 10),
(5, 'Sexta-feira', '2026-09-25', 'Almoço', 4, 1, 5, 7, 9);

-- Inserindo Avaliações Iniciais de Exemplo
INSERT INTO avaliacoes (cardapio_id, prato_id, nota, categoria_feedback, comentario, tipo_usuario, serie_turma, data_avaliacao) VALUES
(1, 2, 5, 'Sabor', 'O strogonoff estava delicioso hoje! Parabéns à equipe da cozinha.', 'Aluno', '9º Ano A', '2026-09-21 12:30:00'),
(1, 7, 4, 'Temperatura', 'Comida bem aquecida e fruta fresquinha.', 'Professor', 'Corpo Docente', '2026-09-21 12:45:00'),
(2, 4, 4, 'Sabor', 'A carne moída estava muito bem temperada.', 'Aluno', '7º Ano C', '2026-09-22 12:15:00'),
(2, 6, 5, 'Apresentação', 'Adorei a salada com manga, muito refrescante!', 'Funcionário', 'Secretaria', '2026-09-22 13:00:00'),
(3, 3, 5, 'Sabor', 'Excelente opção vegetariana, a feijoada estava incrível!', 'Aluno', '3º Ensino Médio', '2026-09-23 12:20:00'),
(4, 2, 4, 'Tamanho da Porção', 'Comida muito boa, porção generosa.', 'Aluno', '6º Ano B', '2026-09-24 12:10:00');
