/* ============================================================
   CARDÁPIO ESCOLAR - SISTEMA DE CONSULTA E AVALIAÇÃO
   Lógica JavaScript (Interatividade + Motor SQL embutido)
   ============================================================ */

// 1. ESTADO E BANCO DE DADOS EM MEMÓRIA (Persistência via LocalStorage)
const INITIAL_DATABASE = {
    pratos: [
        { id: 1, nome: 'Arroz Integral com Feijão Carioca', categoria: 'Acompanhamento', descricao: 'Arroz soltinho rico em fibras e feijão temperado com alho e louro.', calorias: 240, proteinas: 8.5, gluten: false, lactose: false, veg: true, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80' },
        { id: 2, nome: 'Strogonoff de Frango Leve', categoria: 'Prato Principal', descricao: 'Peito de frango em cubos com molho caseiro de tomate e iogurte natural.', calorias: 310, proteinas: 26.0, gluten: false, lactose: true, veg: false, img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=80' },
        { id: 3, nome: 'Feijoada Vegetariana Especial', categoria: 'Prato Principal', descricao: 'Feijão preto com abóbora, cenoura, tofu defumado e couve refogada.', calorias: 280, proteinas: 14.0, gluten: false, lactose: false, veg: true, img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80' },
        { id: 4, nome: 'Carne Moída com Batatas ao Forno', categoria: 'Prato Principal', descricao: 'Patinho moído refogado com batatas em cubos e cheiro-verde fresco.', calorias: 290, proteinas: 24.5, gluten: false, lactose: false, veg: false, img: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=500&q=80' },
        { id: 5, nome: 'Salada Colorida de Vagem e Cenoura', categoria: 'Salada', descricao: 'Cenoura ralada, vagem cozida no vapor, tomate cereja e azeite extravirgem.', calorias: 65, proteinas: 1.8, gluten: false, lactose: false, veg: true, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80' },
        { id: 6, nome: 'Salada Tropical de Alface e Manga', categoria: 'Salada', descricao: 'Mix de alface crespa crocante, mangas frescas em cubos e sementes.', calorias: 75, proteinas: 1.2, gluten: false, lactose: false, veg: true, img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80' },
        { id: 7, nome: 'Banana Caturra Doce', categoria: 'Sobremesa', descricao: 'Banana fresca da estação rica em potássio e energia.', calorias: 90, proteinas: 1.1, gluten: false, lactose: false, veg: true, img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80' },
        { id: 8, nome: 'Melancia Fatiada Geladinha', categoria: 'Sobremesa', descricao: 'Fatia suculenta e hidratante de melancia fresca.', calorias: 60, proteinas: 0.9, gluten: false, lactose: false, veg: true, img: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=500&q=80' },
        { id: 9, nome: 'Suco Natural de Laranja', categoria: 'Bebida', descricao: 'Suco 100% fruta espremida na hora, sem adição de açúcar.', calorias: 110, proteinas: 1.5, gluten: false, lactose: false, veg: true, img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80' },
        { id: 10, Suco: 'Suco de Maracujá com Hortelã', nome: 'Suco de Maracujá com Hortelã', categoria: 'Bebida', descricao: 'Suco refrescante de maracujá com folhas de hortelã.', calorias: 85, proteinas: 0.8, gluten: false, lactose: false, veg: true, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80' }
    ],

    cardapios: [
        { id: 1, dia: 'Segunda-feira', pratosIds: [2, 1, 5, 7, 9] },
        { id: 2, dia: 'Terça-feira', pratosIds: [4, 1, 6, 8, 10] },
        { id: 3, dia: 'Quarta-feira', pratosIds: [3, 1, 5, 7, 9] },
        { id: 4, dia: 'Quinta-feira', pratosIds: [2, 1, 6, 8, 10] },
        { id: 5, dia: 'Sexta-feira', pratosIds: [4, 1, 5, 7, 9] }
    ],

    avaliacoes: [
        { id: 1, cardapioId: 1, pratoId: 2, nota: 5, categoria: 'Sabor', comentario: 'O strogonoff estava super cremoso e muito saboroso!', tipoUsuario: 'Aluno', serie: '9º Ano A', data: '2026-09-21 12:30' },
        { id: 2, cardapioId: 1, pratoId: 7, nota: 4, categoria: 'Temperatura', comentario: 'Comida no ponto certo e banana fresquinha.', tipoUsuario: 'Professor', serie: 'Docente', data: '2026-09-21 12:45' },
        { id: 3, cardapioId: 2, pratoId: 4, nota: 5, categoria: 'Sabor', comentario: 'Carne moída com batata nota 10, tempero perfeito!', tipoUsuario: 'Aluno', serie: '7º Ano C', data: '2026-09-22 12:15' },
        { id: 4, cardapioId: 3, pratoId: 3, nota: 5, categoria: 'Variedade', comentario: 'A feijoada vegetariana superou minhas expectativas.', tipoUsuario: 'Aluno', serie: '3º EM', data: '2026-09-23 12:20' }
    ]
};

// Inicialização da base de dados local
function getDatabase() {
    const saved = localStorage.getItem('CARDAPIO_DB');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Erro ao carregar banco local, usando inicial.", e);
        }
    }
    localStorage.setItem('CARDAPIO_DB', JSON.stringify(INITIAL_DATABASE));
    return INITIAL_DATABASE;
}

function saveDatabase(db) {
    localStorage.setItem('CARDAPIO_DB', JSON.stringify(db));
}

let db = getDatabase();
let currentSelectedDay = 'Segunda-feira';
let selectedStarRating = 0;
let selectedFeedbackCategory = '';

// 2. INICIALIZAÇÃO DA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    renderDaySelector();
    renderMenuForDay(currentSelectedDay);
    initRatingForm();
    renderStatsDashboard();
    initSqlConsole();
});

// 3. NAVEGAÇÃO ENTRE ABAS
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-view');
            if (!targetId) return;

            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            link.classList.add('active');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Atualiza estatísticas ao abrir a aba
            if (targetId === 'view-estatisticas') {
                renderStatsDashboard();
            }
        });
    });
}

// 4. MODO CLARO / ESCURO (THEME)
function initTheme() {
    const toggleBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('CARDAPIO_THEME') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    toggleBtn?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('CARDAPIO_THEME', next);
        toggleBtn.innerHTML = next === 'dark' ? '☀️' : '🌙';
    });
    if (toggleBtn) {
        toggleBtn.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

// 5. SELETOR DE DIAS DA SEMANA
function renderDaySelector() {
    const daysContainer = document.getElementById('daysContainer');
    if (!daysContainer) return;

    const dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
    daysContainer.innerHTML = dias.map(d => `
        <button class="day-btn ${d === currentSelectedDay ? 'active' : ''}" data-day="${d}">
            ${d}
        </button>
    `).join('');

    daysContainer.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSelectedDay = btn.getAttribute('data-day');
            daysContainer.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMenuForDay(currentSelectedDay);
        });
    });
}

// 6. RENDERIZAÇÃO DO CARDÁPIO DO DIA
function renderMenuForDay(dia) {
    const menuGrid = document.getElementById('menuGrid');
    const dayTitle = document.getElementById('currentDayTitle');
    if (!menuGrid) return;

    if (dayTitle) dayTitle.textContent = `Cardápios de ${dia}`;

    const cardapioDoDia = db.cardapios.find(c => c.dia === dia);
    if (!cardapioDoDia) {
        menuGrid.innerHTML = `<p class="text-muted">Nenhum cardápio cadastrado para este dia.</p>`;
        return;
    }

    const pratosDoDia = cardapioDoDia.pratosIds.map(id => db.pratos.find(p => p.id === id)).filter(Boolean);

    menuGrid.innerHTML = pratosDoDia.map(prato => {
        // Cálculo da média de estrelas deste prato
        const avs = db.avaliacoes.filter(a => a.pratoId === prato.id);
        const media = avs.length > 0 ? (avs.reduce((acc, a) => acc + a.nota, 0) / avs.length).toFixed(1) : 'Novo';
        const starsText = avs.length > 0 ? `★ ${media} (${avs.length})` : '★ Sem notas';

        return `
            <div class="menu-card">
                <div class="card-img-container">
                    <img src="${prato.img}" alt="${prato.nome}" loading="lazy" onError="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'">
                    <span class="card-category-badge">${prato.categoria}</span>
                    <span class="card-calories-badge">🔥 ${prato.calorias} kcal</span>
                </div>
                <div class="card-body">
                    <h3>${prato.nome}</h3>
                    <p>${prato.descricao}</p>
                    <div class="tags-row">
                        ${prato.veg ? '<span class="tag-pill veg">🌱 Vegetariano</span>' : ''}
                        ${!prato.gluten ? '<span class="tag-pill gluten">🌾 Sem Glúten</span>' : ''}
                        ${!prato.lactose ? '<span class="tag-pill lactose">🥛 Sem Lactose</span>' : ''}
                    </div>
                    <div class="card-footer">
                        <span class="rating-stars-inline">${starsText}</span>
                        <button class="btn btn-secondary btn-sm btn-eval-dish" onclick="openRatingModal(${prato.id})">
                            Avaliar Prato
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 7. FORMULÁRIO DE AVALIAÇÃO INTERATIVO
function initRatingForm() {
    const starContainer = document.getElementById('starRatingInput');
    const dishSelect = document.getElementById('dishSelect');
    const categoryChips = document.querySelectorAll('.category-chip');
    const form = document.getElementById('evalForm');

    // Popular select de pratos
    if (dishSelect) {
        dishSelect.innerHTML = `<option value="">-- Cardápio Geral / Todos os Pratos --</option>` +
            db.pratos.map(p => `<option value="${p.id}">${p.nome} (${p.categoria})</option>`).join('');
    }

    // Interatividade das Estrelas
    if (starContainer) {
        const stars = starContainer.querySelectorAll('span');
        stars.forEach((star, index) => {
            star.addEventListener('mouseover', () => highlightStars(index + 1));
            star.addEventListener('mouseleave', () => highlightStars(selectedStarRating));
            star.addEventListener('click', () => {
                selectedStarRating = index + 1;
                highlightStars(selectedStarRating);
            });
        });
    }

    function highlightStars(count) {
        if (!starContainer) return;
        const stars = starContainer.querySelectorAll('span');
        stars.forEach((s, idx) => {
            if (idx < count) {
                s.classList.add('selected');
            } else {
                s.classList.remove('selected');
            }
        });
    }

    // Seleção de Chips de Categoria (Sabor, Temperatura, etc)
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            selectedFeedbackCategory = chip.getAttribute('data-cat') || chip.textContent;
        });
    });

    // Submissão do Formulário
    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        if (selectedStarRating === 0) {
            showToast('⚠️ Por favor, selecione quantas estrelas (1 a 5) você avalia este prato.');
            return;
        }

        const pratoIdVal = dishSelect.value ? parseInt(dishSelect.value) : null;
        const comentarioVal = document.getElementById('evalComment').value.trim();
        const userTypeVal = document.getElementById('userTypeSelect').value;
        const serieVal = document.getElementById('userGradeInput').value.trim() || 'Não informada';

        const novaAvaliacao = {
            id: Date.now(),
            cardapioId: 1, // Padrão
            pratoId: pratoIdVal,
            nota: selectedStarRating,
            categoria: selectedFeedbackCategory || 'Geral',
            comentario: comentarioVal || 'Sem comentário',
            tipoUsuario: userTypeVal,
            serie: serieVal,
            data: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };

        db.avaliacoes.unshift(novaAvaliacao);
        saveDatabase(db);

        // Limpa formulário e reseta UI
        form.reset();
        selectedStarRating = 0;
        highlightStars(0);
        categoryChips.forEach(c => c.classList.remove('selected'));

        showToast('✅ Sua avaliação foi registrada com sucesso no banco de dados!');

        // Atualiza visualizações
        renderMenuForDay(currentSelectedDay);
        renderStatsDashboard();
    });
}

window.openRatingModal = function(pratoId) {
    // Troca para a aba de avaliação
    const evalTab = document.querySelector('[data-view="view-avaliar"]');
    if (evalTab) evalTab.click();

    const dishSelect = document.getElementById('dishSelect');
    if (dishSelect) dishSelect.value = pratoId;
};

// 8. PAINEL DE ESTATÍSTICAS E MÉDIAS DE SATISFAÇÃO
function renderStatsDashboard() {
    const totalAvsEl = document.getElementById('statTotalReviews');
    const avgScoreEl = document.getElementById('statAvgScore');
    const topDishEl = document.getElementById('statTopDish');
    const feedbackListEl = document.getElementById('recentFeedbacksList');

    const total = db.avaliacoes.length;
    const avg = total > 0 ? (db.avaliacoes.reduce((acc, a) => acc + a.nota, 0) / total).toFixed(2) : '0.0';

    if (totalAvsEl) totalAvsEl.textContent = total;
    if (avgScoreEl) avgScoreEl.textContent = `${avg} / 5.0`;

    // Encontrar prato mais bem avaliado
    let bestDishName = 'N/A';
    if (total > 0) {
        const scores = {};
        db.avaliacoes.forEach(a => {
            if (a.pratoId) {
                if (!scores[a.pratoId]) scores[a.pratoId] = { sum: 0, count: 0 };
                scores[a.pratoId].sum += a.nota;
                scores[a.pratoId].count += 1;
            }
        });
        let bestAvg = -1;
        let bestId = null;
        Object.keys(scores).forEach(pid => {
            const mean = scores[pid].sum / scores[pid].count;
            if (mean > bestAvg) {
                bestAvg = mean;
                bestId = pid;
            }
        });
        if (bestId) {
            const foundPrato = db.pratos.find(p => p.id === parseInt(bestId));
            if (foundPrato) bestDishName = foundPrato.nome;
        }
    }
    if (topDishEl) topDishEl.textContent = bestDishName;

    // Listar últimas avaliações
    if (feedbackListEl) {
        if (total === 0) {
            feedbackListEl.innerHTML = `<p class="text-muted">Nenhuma avaliação cadastrada ainda.</p>`;
            return;
        }

        feedbackListEl.innerHTML = db.avaliacoes.slice(0, 10).map(av => {
            const pratoRel = db.pratos.find(p => p.id === av.pratoId);
            const pratoNome = pratoRel ? pratoRel.nome : 'Cardápio Geral';
            const starsHTML = '★'.repeat(av.nota) + '☆'.repeat(5 - av.nota);

            return `
                <div class="feedback-item">
                    <div class="feedback-header">
                        <div class="feedback-user-info">
                            <strong style="color: var(--primary);">${pratoNome}</strong>
                            <span class="user-badge">${av.tipoUsuario} • ${av.serie}</span>
                        </div>
                        <span class="rating-stars-inline">${starsHTML}</span>
                    </div>
                    <p style="font-size: 0.95rem; margin-bottom: 6px;">"${av.comentario}"</p>
                    <div class="feedback-date">Enviado em ${av.data} • Categoria: ${av.categoria}</div>
                </div>
            `;
        }).join('');
    }
}

// 9. CONSOLE SQL INTERATIVO (Motor SQL simulado para aprendizado)
function initSqlConsole() {
    const runBtn = document.getElementById('btnRunSql');
    const presetSelect = document.getElementById('sqlPresetSelect');
    const textarea = document.getElementById('sqlQueryInput');
    const resultBox = document.getElementById('sqlResultBox');

    const PRESET_QUERIES = {
        'all_pratos': 'SELECT id, nome, categoria, calorias, proteinas FROM pratos ORDER BY calorias DESC;',
        'avg_ratings': 'SELECT prato_id, AVG(nota) AS media_nota, COUNT(id) AS total_votos FROM avaliacoes GROUP BY prato_id;',
        'all_avaliacoes': 'SELECT id, prato_id, nota, categoria, comentario, tipo_usuario, data FROM avaliacoes ORDER BY id DESC;',
        'segunda_menu': 'SELECT * FROM cardapio_semanal WHERE dia_semana = "Segunda-feira";'
    };

    presetSelect?.addEventListener('change', () => {
        const val = presetSelect.value;
        if (PRESET_QUERIES[val]) {
            textarea.value = PRESET_QUERIES[val];
        }
    });

    runBtn?.addEventListener('click', () => {
        executeSqlQuery(textarea.value.trim(), resultBox);
    });
}

function executeSqlQuery(query, resultBox) {
    if (!resultBox) return;
    const cleanQuery = query.toLowerCase();

    try {
        if (cleanQuery.includes('select') && cleanQuery.includes('from pratos')) {
            renderSqlTable(resultBox, ['ID', 'Nome', 'Categoria', 'Calorias (kcal)', 'Proteínas (g)', 'Vegano?'],
                db.pratos.map(p => [p.id, p.nome, p.categoria, p.calorias, p.proteinas, p.veg ? 'Sim' : 'Não']));
        } 
        else if (cleanQuery.includes('select') && cleanQuery.includes('from avaliacoes')) {
            renderSqlTable(resultBox, ['ID', 'Prato ID', 'Nota (Estrelas)', 'Categoria', 'Comentário', 'Tipo Usuário', 'Data'],
                db.avaliacoes.map(a => [a.id, a.pratoId || 'Geral', `★ ${a.nota}`, a.categoria, a.comentario, a.tipoUsuario, a.data]));
        }
        else if (cleanQuery.includes('avg(nota)') || cleanQuery.includes('group by')) {
            const grouped = {};
            db.avaliacoes.forEach(a => {
                const key = a.pratoId || 'Geral';
                if (!grouped[key]) grouped[key] = { sum: 0, count: 0 };
                grouped[key].sum += a.nota;
                grouped[key].count += 1;
            });
            const rows = Object.keys(grouped).map(pid => {
                const pratoObj = db.pratos.find(p => p.id === parseInt(pid));
                const nome = pratoObj ? pratoObj.nome : 'Cardápio Geral';
                const mean = (grouped[pid].sum / grouped[pid].count).toFixed(2);
                return [pid, nome, `${mean} ★`, grouped[pid].count];
            });
            renderSqlTable(resultBox, ['Prato ID', 'Nome do Prato', 'Média de Nota', 'Total de Votos'], rows);
        }
        else if (cleanQuery.includes('select') && cleanQuery.includes('cardapio')) {
            renderSqlTable(resultBox, ['ID', 'Dia da Semana', 'Qtd Pratos Servidos'],
                db.cardapios.map(c => [c.id, c.dia, c.pratosIds.length]));
        }
        else {
            // Consulta SQL genérica padrão
            renderSqlTable(resultBox, ['ID', 'Nome / Descrição', 'Info'], [
                [1, 'Consulta SQL Executada com Sucesso', 'Motor SQL OK'],
                [2, 'Registros afetados', db.avaliacoes.length]
            ]);
        }
        showToast('⚡ Query SQL executada com sucesso!');
    } catch (e) {
        resultBox.innerHTML = `<div style="padding: 16px; color: #ef4444;">Erro ao executar SQL: ${e.message}</div>`;
    }
}

function renderSqlTable(container, headers, rows) {
    if (rows.length === 0) {
        container.innerHTML = `<p style="padding: 20px; color: var(--text-muted);">Nenhum resultado retornado para a consulta.</p>`;
        return;
    }

    const headerHTML = headers.map(h => `<th>${h}</th>`).join('');
    const rowsHTML = rows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');

    container.innerHTML = `
        <table class="data-table">
            <thead><tr>${headerHTML}</tr></thead>
            <tbody>${rowsHTML}</tbody>
        </table>
    `;
}

// 10. NOTIFICAÇÕES TOAST
function showToast(msg) {
    let toastBox = document.getElementById('toastContainer');
    if (!toastBox) {
        toastBox = document.createElement('div');
        toastBox.id = 'toastContainer';
        toastBox.className = 'toast-container';
        document.body.appendChild(toastBox);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${msg}</span>`;
    toastBox.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
