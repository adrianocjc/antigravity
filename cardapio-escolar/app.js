/* ============================================================
   CARDÁPIO ESCOLAR - SISTEMA DE CONSULTA, AVALIAÇÃO,
   PORTAL DO ALUNO/SERVIDOR & GESTÃO DE NECESSIDADES ALIMENTARES
   Lógica JavaScript Frontend (LocalStorage + Suporte API SQLite)
   ============================================================ */

// 1. DADOS INICIAIS DA BASE LOCAL (SEED)
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
        { id: 10, nome: 'Suco de Maracujá com Hortelã', categoria: 'Bebida', descricao: 'Suco refrescante de maracujá com folhas de hortelã.', calorias: 85, proteinas: 0.8, gluten: false, lactose: false, veg: true, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80' }
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
    ],

    usuarios: [
        { id: 1, nome: 'Lucas Silva', email: 'aluno@escola.edu', senha: '123456', tipo_usuario: 'Aluno', turma_setor: '8º Ano A' },
        { id: 2, nome: 'Mariana Oliveira', email: 'mariana@escola.edu', senha: '123456', tipo_usuario: 'Aluno', turma_setor: '9º Ano B' },
        { id: 3, nome: 'Profª Ana Costa', email: 'professor@escola.edu', senha: '123456', tipo_usuario: 'Professor', turma_setor: 'Corpo Docente' },
        { id: 4, nome: 'Roberto Santos', email: 'roberto@escola.edu', senha: '123456', tipo_usuario: 'Funcionário', turma_setor: 'Secretaria Escolar' },
        { id: 5, nome: 'Coordenadora Maria', email: 'admin@escola.edu', senha: 'admin123', tipo_usuario: 'Admin', turma_setor: 'Gestão & Coordenação' }
    ],

    necessidades: {
        1: { usuario_id: 1, intolerancia_lactose: 1, restricao_gluten: 0, vegetariano: 0, vegano: 0, diabetes: 0, alergia_amendoim: 0, alergia_frutos_mar: 0, alergia_ovo: 0, alergia_corantes: 0, outras_alergias: 'Nenhuma', observacoes_medicas: 'Intolerância moderada a lactose. Evitar leite puro e queijo.', contato_emergencia: 'Mãe: (84) 99888-1122' },
        2: { usuario_id: 2, intolerancia_lactose: 0, restricao_gluten: 1, vegetariano: 1, vegano: 0, diabetes: 0, alergia_amendoim: 1, alergia_frutos_mar: 0, alergia_ovo: 0, alergia_corantes: 0, outras_alergias: 'Alergia severa a Amendoim', observacoes_medicas: 'Diagnóstico de Doença Celíaca. Risco de choque anafilático com amendoim.', contato_emergencia: 'Pai: (84) 98777-3344' },
        3: { usuario_id: 3, intolerancia_lactose: 0, restricao_gluten: 0, vegetariano: 0, vegano: 1, diabetes: 1, alergia_amendoim: 0, alergia_frutos_mar: 0, alergia_ovo: 0, alergia_corantes: 0, outras_alergias: 'Nenhuma', observacoes_medicas: 'Dieta estritamente vegana e controle de glicemia (Diabetes Tipo 2).', contato_emergencia: 'Esposo: (84) 99111-5566' },
        4: { usuario_id: 4, intolerancia_lactose: 1, restricao_gluten: 0, vegetariano: 0, vegano: 0, diabetes: 0, alergia_amendoim: 0, alergia_frutos_mar: 1, alergia_ovo: 1, alergia_corantes: 0, outras_alergias: 'Camarão e frutos do mar', observacoes_medicas: 'Reação alérgica a frutos do mar e ovos.', contato_emergencia: 'Esposa: (84) 98822-7788' }
    }
};

// 2. GESTÃO DE ESTADO LOCALSTORAGE
function getDatabase() {
    const saved = localStorage.getItem('CARDAPIO_DB');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (!parsed.usuarios) parsed.usuarios = INITIAL_DATABASE.usuarios;
            if (!parsed.necessidades) parsed.necessidades = INITIAL_DATABASE.necessidades;
            return parsed;
        } catch (e) {
            console.error("Erro ao carregar banco local, usando inicial.", e);
        }
    }
    localStorage.setItem('CARDAPIO_DB', JSON.stringify(INITIAL_DATABASE));
    return INITIAL_DATABASE;
}

function saveDatabase(data) {
    localStorage.setItem('CARDAPIO_DB', JSON.stringify(data));
}

let db = getDatabase();
let currentSelectedDay = 'Segunda-feira';
let selectedStarRating = 0;
let selectedFeedbackCategory = '';
let currentUser = JSON.parse(localStorage.getItem('CARDAPIO_CURRENT_USER') || 'null');
let isAdminAuthenticated = localStorage.getItem('CARDAPIO_ADMIN_AUTH') === 'true';

// 3. INICIALIZAÇÃO DA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    renderDaySelector();
    renderMenuForDay(currentSelectedDay);
    initRatingForm();
    renderStatsDashboard();
    initAuthAndProfile();
    initAdminPanel();
    initSqlConsole();
    updateUserNavUI();
});

// 4. NAVEGAÇÃO ENTRE ABAS
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

            // Ações específicas ao abrir abas
            if (targetId === 'view-estatisticas') {
                renderStatsDashboard();
            }
            if (targetId === 'view-portal-usuario') {
                checkUserProfileState();
            }
            if (targetId === 'view-admin-gestao') {
                checkAdminState();
            }
        });
    });
}

// 5. MODO CLARO / ESCURO (THEME)
function initTheme() {
    const toggleBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('CARDAPIO_THEME') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    toggleBtn?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('CARDAPIO_THEME', next);
        if (toggleBtn) toggleBtn.innerHTML = next === 'dark' ? '☀️' : '🌙';
    });
    if (toggleBtn) {
        toggleBtn.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

// 6. SELETOR DE DIAS DA SEMANA E RENDERIZAÇÃO DO CARDÁPIO
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

// 7. FORMULÁRIO DE AVALIAÇÃO
function initRatingForm() {
    const starContainer = document.getElementById('starRatingInput');
    const dishSelect = document.getElementById('dishSelect');
    const categoryChips = document.querySelectorAll('.category-chip');
    const form = document.getElementById('evalForm');

    if (dishSelect) {
        dishSelect.innerHTML = `<option value="">-- Cardápio Geral / Todos os Pratos --</option>` +
            db.pratos.map(p => `<option value="${p.id}">${p.nome} (${p.categoria})</option>`).join('');
    }

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
            if (idx < count) s.classList.add('selected');
            else s.classList.remove('selected');
        });
    }

    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            selectedFeedbackCategory = chip.getAttribute('data-cat') || chip.textContent;
        });
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        if (selectedStarRating === 0) {
            showToast('⚠️ Por favor, selecione quantas estrelas (1 a 5) você avalia.');
            return;
        }

        const pratoIdVal = dishSelect.value ? parseInt(dishSelect.value) : null;
        const comentarioVal = document.getElementById('evalComment').value.trim();
        const userTypeVal = document.getElementById('userTypeSelect').value;
        const serieVal = document.getElementById('userGradeInput').value.trim() || 'Não informada';

        const novaAvaliacao = {
            id: Date.now(),
            cardapioId: 1,
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

        form.reset();
        selectedStarRating = 0;
        highlightStars(0);
        categoryChips.forEach(c => c.classList.remove('selected'));

        showToast('✅ Sua avaliação foi registrada com sucesso!');
        renderMenuForDay(currentSelectedDay);
        renderStatsDashboard();
    });
}

window.openRatingModal = function(pratoId) {
    const evalTab = document.querySelector('[data-view="view-avaliar"]');
    if (evalTab) evalTab.click();
    const dishSelect = document.getElementById('dishSelect');
    if (dishSelect) dishSelect.value = pratoId;
};

// 8. PAINEL DE ESTATÍSTICAS
function renderStatsDashboard() {
    const totalAvsEl = document.getElementById('statTotalReviews');
    const avgScoreEl = document.getElementById('statAvgScore');
    const topDishEl = document.getElementById('statTopDish');
    const feedbackListEl = document.getElementById('recentFeedbacksList');

    const total = db.avaliacoes.length;
    const avg = total > 0 ? (db.avaliacoes.reduce((acc, a) => acc + a.nota, 0) / total).toFixed(2) : '0.0';

    if (totalAvsEl) totalAvsEl.textContent = total;
    if (avgScoreEl) avgScoreEl.textContent = `${avg} / 5.0`;

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

// ------------------------------------------------------------
// 9. PORTAL DO ALUNO / SERVIDOR (AUTENTICAÇÃO & NECESSIDADES)
// ------------------------------------------------------------
function initAuthAndProfile() {
    const btnShowLogin = document.getElementById('btnShowLogin');
    const btnShowRegister = document.getElementById('btnShowRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const dietaryForm = document.getElementById('dietaryForm');

    // Alternar entre abas Login / Cadastro
    btnShowLogin?.addEventListener('click', () => {
        btnShowLogin.classList.add('active');
        btnShowRegister.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    btnShowRegister?.addEventListener('click', () => {
        btnShowRegister.classList.add('active');
        btnShowLogin.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    // Submissão do Login
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const senha = document.getElementById('loginSenha').value;

        // Tentar autenticar via backend API Express se disponível
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });
            if (res.ok) {
                const data = await res.json();
                loginUserSuccess(data.user);
                return;
            }
        } catch (e) {
            console.log("Servidor backend offline, usando autenticação local LocalStorage.");
        }

        // Fallback local
        const userFound = db.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha);
        if (userFound) {
            loginUserSuccess(userFound);
        } else {
            showToast('❌ E-mail ou senha incorretos. Tente novamente.');
        }
    });

    // Submissão do Cadastro
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('regNome').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const tipo_usuario = document.getElementById('regTipo').value;
        const turma_setor = document.getElementById('regTurma').value.trim();
        const senha = document.getElementById('regSenha').value;

        // Tentar registrar via Express API
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha, tipo_usuario, turma_setor })
            });
            if (res.ok) {
                const data = await res.json();
                showToast('✨ Cadastro realizado com sucesso!');
                loginUserSuccess(data.user);
                return;
            } else {
                const errData = await res.json();
                showToast(`⚠️ ${errData.error || 'Erro ao cadastrar.'}`);
                return;
            }
        } catch (e) {
            console.log("Servidor backend offline, salvando cadastro localmente.");
        }

        // Fallback local
        if (db.usuarios.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            showToast('⚠️ Este e-mail já está cadastrado no sistema.');
            return;
        }

        const newUser = {
            id: Date.now(),
            nome,
            email,
            senha,
            tipo_usuario,
            turma_setor
        };

        db.usuarios.push(newUser);
        db.necessidades[newUser.id] = {
            usuario_id: newUser.id,
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
        };
        saveDatabase(db);

        showToast('✨ Conta criada com sucesso!');
        loginUserSuccess(newUser);
    });

    // Submissão do Formulário de Necessidades Alimentares
    dietaryForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) {
            showToast('⚠️ Faça login para salvar suas necessidades alimentares.');
            return;
        }

        const needsData = {
            usuario_id: currentUser.id,
            intolerancia_lactose: document.getElementById('chkLactose').checked ? 1 : 0,
            restricao_gluten: document.getElementById('chkGluten').checked ? 1 : 0,
            vegetariano: document.getElementById('chkVeg').checked ? 1 : 0,
            vegano: document.getElementById('chkVegan').checked ? 1 : 0,
            diabetes: document.getElementById('chkDiabetes').checked ? 1 : 0,
            alergia_amendoim: document.getElementById('chkAmendoim').checked ? 1 : 0,
            alergia_frutos_mar: document.getElementById('chkFrutosMar').checked ? 1 : 0,
            alergia_ovo: document.getElementById('chkOvo').checked ? 1 : 0,
            alergia_corantes: document.getElementById('chkCorantes').checked ? 1 : 0,
            outras_alergias: document.getElementById('txtOutrasAlergias').value.trim(),
            observacoes_medicas: document.getElementById('txtObsMedicas').value.trim(),
            contato_emergencia: document.getElementById('txtContatoEmergencia').value.trim()
        };

        // Enviar para API Express se disponível
        try {
            const res = await fetch(`/api/necessidades/${currentUser.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(needsData)
            });
            if (res.ok) {
                showToast('💾 Necessidades alimentares salvas no servidor SQLite!');
            }
        } catch (e) {
            console.log("Servidor offline, salvando necessidades alimentares localmente.");
        }

        // Salvar localmente no LocalStorage
        db.necessidades[currentUser.id] = needsData;
        saveDatabase(db);

        showToast('🔒 Suas restrições alimentares foram salvas e enviadas à Coordenação!');
    });
}

function loginUserSuccess(user) {
    currentUser = user;
    localStorage.setItem('CARDAPIO_CURRENT_USER', JSON.stringify(user));

    if (user.tipo_usuario === 'Admin') {
        isAdminAuthenticated = true;
        localStorage.setItem('CARDAPIO_ADMIN_AUTH', 'true');
    }

    updateUserNavUI();
    checkUserProfileState();
    showToast(`👋 Olá, ${user.nome}! Login realizado com sucesso.`);
}

window.quickLogin = function(email, senha) {
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginSenha').value = senha;
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
};

window.logoutUser = function() {
    currentUser = null;
    localStorage.removeItem('CARDAPIO_CURRENT_USER');
    updateUserNavUI();
    checkUserProfileState();
    showToast('🚪 Você saiu da sua conta.');
};

function updateUserNavUI() {
    const userNavStatus = document.getElementById('userNavStatus');
    const navPortalBtn = document.getElementById('navPortalBtn');
    const navAdminBtn = document.getElementById('navAdminBtn');

    if (currentUser) {
        userNavStatus.innerHTML = `
            <div class="user-nav-pill">
                <span>👤 ${currentUser.nome.split(' ')[0]} (${currentUser.tipo_usuario})</span>
                <button class="btn btn-secondary btn-sm" onclick="logoutUser()" title="Sair da conta" style="padding: 2px 8px;">✕</button>
            </div>
        `;
        if (navPortalBtn) navPortalBtn.textContent = `👤 ${currentUser.nome.split(' ')[0]}`;
    } else {
        userNavStatus.innerHTML = '';
        if (navPortalBtn) navPortalBtn.textContent = `🔐 Portal do Usuário`;
    }
}

function checkUserProfileState() {
    const authContainer = document.getElementById('authContainer');
    const userProfileContainer = document.getElementById('userProfileContainer');

    if (!currentUser) {
        if (authContainer) authContainer.style.display = 'block';
        if (userProfileContainer) userProfileContainer.style.display = 'none';
    } else {
        if (authContainer) authContainer.style.display = 'none';
        if (userProfileContainer) userProfileContainer.style.display = 'block';
        loadUserProfileData();
    }
}

async function loadUserProfileData() {
    if (!currentUser) return;

    document.getElementById('profNome').textContent = currentUser.nome;
    document.getElementById('profTipoBadge').textContent = currentUser.tipo_usuario;
    document.getElementById('profTurmaBadge').textContent = currentUser.turma_setor || 'Escola';
    document.getElementById('profEmail').textContent = currentUser.email;

    let userNeeds = db.necessidades[currentUser.id];

    // Tentar buscar da API se disponível
    try {
        const res = await fetch(`/api/necessidades/${currentUser.id}`);
        if (res.ok) {
            userNeeds = await res.json();
        }
    } catch (e) {
        console.log("Usando necessidades alimentares do LocalStorage.");
    }

    if (userNeeds) {
        document.getElementById('chkLactose').checked = !!userNeeds.intolerancia_lactose;
        document.getElementById('chkGluten').checked = !!userNeeds.restricao_gluten;
        document.getElementById('chkVeg').checked = !!userNeeds.vegetariano;
        document.getElementById('chkVegan').checked = !!userNeeds.vegano;
        document.getElementById('chkDiabetes').checked = !!userNeeds.diabetes;
        document.getElementById('chkAmendoim').checked = !!userNeeds.alergia_amendoim;
        document.getElementById('chkFrutosMar').checked = !!userNeeds.alergia_frutos_mar;
        document.getElementById('chkOvo').checked = !!userNeeds.alergia_ovo;
        document.getElementById('chkCorantes').checked = !!userNeeds.alergia_corantes;

        document.getElementById('txtOutrasAlergias').value = userNeeds.outras_alergias || '';
        document.getElementById('txtObsMedicas').value = userNeeds.observacoes_medicas || '';
        document.getElementById('txtContatoEmergencia').value = userNeeds.contato_emergencia || '';
    }
}

// ------------------------------------------------------------
// 10. PAINEL DE GESTÃO DA COORDENAÇÃO (ADMINISTRADOR)
// ------------------------------------------------------------
function initAdminPanel() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminSearchInput = document.getElementById('adminSearchInput');
    const adminFilterUserType = document.getElementById('adminFilterUserType');
    const adminFilterRestriction = document.getElementById('adminFilterRestriction');

    adminLoginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = document.getElementById('adminPassInput').value;

        if (pass === 'admin123' || (currentUser && currentUser.tipo_usuario === 'Admin')) {
            isAdminAuthenticated = true;
            localStorage.setItem('CARDAPIO_ADMIN_AUTH', 'true');
            checkAdminState();
            showToast('🔓 Acesso de Gestor/Administrador concedido com sucesso!');
        } else {
            showToast('❌ Senha de administrador incorreta.');
        }
    });

    adminSearchInput?.addEventListener('input', renderAdminTable);
    adminFilterUserType?.addEventListener('change', renderAdminTable);
    adminFilterRestriction?.addEventListener('change', renderAdminTable);
}

function checkAdminState() {
    const adminAuthPrompt = document.getElementById('adminAuthPrompt');
    const adminDashboardContainer = document.getElementById('adminDashboardContainer');

    if (currentUser && currentUser.tipo_usuario === 'Admin') {
        isAdminAuthenticated = true;
        localStorage.setItem('CARDAPIO_ADMIN_AUTH', 'true');
    }

    if (isAdminAuthenticated) {
        if (adminAuthPrompt) adminAuthPrompt.style.display = 'none';
        if (adminDashboardContainer) adminDashboardContainer.style.display = 'block';
        loadAdminData();
    } else {
        if (adminAuthPrompt) adminAuthPrompt.style.display = 'block';
        if (adminDashboardContainer) adminDashboardContainer.style.display = 'none';
    }
}

window.logoutAdmin = function() {
    isAdminAuthenticated = false;
    localStorage.removeItem('CARDAPIO_ADMIN_AUTH');
    checkAdminState();
    showToast('🔒 Saiu do Painel da Gestão.');
};

async function loadAdminData() {
    // Tentar carregar via API backend
    try {
        const res = await fetch('/api/admin/necessidades');
        if (res.ok) {
            const apiRows = await res.json();
            // Atualizar banco local para sincronia
            apiRows.forEach(row => {
                const uExists = db.usuarios.find(u => u.id === row.usuario_id);
                if (!uExists) {
                    db.usuarios.push({
                        id: row.usuario_id,
                        nome: row.nome,
                        email: row.email,
                        tipo_usuario: row.tipo_usuario,
                        turma_setor: row.turma_setor
                    });
                }
                db.necessidades[row.usuario_id] = row;
            });
        }
    } catch (e) {
        console.log("Carregando dados da Gestão via LocalStorage.");
    }

    renderAdminMetrics();
    renderAdminTable();
}

function renderAdminMetrics() {
    const users = db.usuarios;
    const totalUsers = users.length;

    let withRestrictions = 0;
    let lactoseCount = 0;
    let glutenCount = 0;
    let vegCount = 0;

    users.forEach(u => {
        const n = db.necessidades[u.id];
        if (n) {
            const hasAny = n.intolerancia_lactose || n.restricao_gluten || n.vegetariano || n.vegano || n.diabetes || n.alergia_amendoim || n.alergia_frutos_mar || n.alergia_ovo || n.alergia_corantes || (n.outras_alergias && n.outras_alergias.trim() !== 'Nenhuma' && n.outras_alergias.trim() !== '');
            if (hasAny) withRestrictions++;
            if (n.intolerancia_lactose) lactoseCount++;
            if (n.restricao_gluten) glutenCount++;
            if (n.vegetariano || n.vegano) vegCount++;
        }
    });

    const elTotal = document.getElementById('adminStatTotalUsers');
    const elRest = document.getElementById('adminStatTotalRestrictions');
    const elLacGluten = document.getElementById('adminStatLactoseGluten');
    const elVeg = document.getElementById('adminStatVeg');

    if (elTotal) elTotal.textContent = totalUsers;
    if (elRest) elRest.textContent = withRestrictions;
    if (elLacGluten) elLacGluten.textContent = `${lactoseCount} / ${glutenCount}`;
    if (elVeg) elVeg.textContent = vegCount;
}

function renderAdminTable() {
    const tbody = document.getElementById('adminTableBody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('adminSearchInput')?.value || '').toLowerCase().trim();
    const filterType = document.getElementById('adminFilterUserType')?.value || 'Todos';
    const filterRest = document.getElementById('adminFilterRestriction')?.value || 'Todas';

    let filtered = db.usuarios.filter(u => {
        if (filterType !== 'Todos' && u.tipo_usuario !== filterType) return false;

        const n = db.necessidades[u.id] || {};

        if (filterRest === 'lactose' && !n.intolerancia_lactose) return false;
        if (filterRest === 'gluten' && !n.restricao_gluten) return false;
        if (filterRest === 'amendoim' && !n.alergia_amendoim) return false;
        if (filterRest === 'frutos_mar' && !n.alergia_frutos_mar) return false;
        if (filterRest === 'veg' && (!n.vegetariano && !n.vegano)) return false;
        if (filterRest === 'diabetes' && !n.diabetes) return false;

        if (searchTerm) {
            const matchName = u.nome.toLowerCase().includes(searchTerm);
            const matchEmail = u.email.toLowerCase().includes(searchTerm);
            const matchTurma = (u.turma_setor || '').toLowerCase().includes(searchTerm);
            const matchObs = (n.observacoes_medicas || '').toLowerCase().includes(searchTerm) || (n.outras_alergias || '').toLowerCase().includes(searchTerm);
            if (!matchName && !matchEmail && !matchTurma && !matchObs) return false;
        }

        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">Nenhum usuário encontrado com os filtros selecionados.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(user => {
        const n = db.necessidades[user.id] || {};
        const badges = [];

        if (n.alergia_amendoim) badges.push('<span class="badge-restriction badge-danger">⚠️ ALERGIA AMENDOIM</span>');
        if (n.alergia_frutos_mar) badges.push('<span class="badge-restriction badge-danger">🦐 FRUTOS DO MAR</span>');
        if (n.restricao_gluten) badges.push('<span class="badge-restriction badge-gluten">🌾 Glúten / Celíaco</span>');
        if (n.intolerancia_lactose) badges.push('<span class="badge-restriction badge-lactose">🥛 Lactose</span>');
        if (n.vegano) badges.push('<span class="badge-restriction badge-vegan">🌿 Vegano</span>');
        else if (n.vegetariano) badges.push('<span class="badge-restriction badge-veg">🌱 Vegetariano</span>');
        if (n.diabetes) badges.push('<span class="badge-restriction badge-diabetes">🍬 Diabetes</span>');
        if (n.alergia_ovo) badges.push('<span class="badge-restriction badge-lactose">🥚 Ovo</span>');
        if (n.alergia_corantes) badges.push('<span class="badge-restriction badge-lactose">🩸 Corantes</span>');
        if (n.outras_alergias && n.outras_alergias.trim() !== '' && n.outras_alergias.trim() !== 'Nenhuma') {
            badges.push(`<span class="badge-restriction badge-gluten">🏷️ ${n.outras_alergias}</span>`);
        }

        const badgesHTML = badges.length > 0 ? badges.join('') : '<span style="color: var(--text-light); font-size: 0.85rem;">Sem restrições declaradas</span>';
        const obsText = n.observacoes_medicas ? `<strong>Obs:</strong> ${n.observacoes_medicas}` : '<span style="color: var(--text-light);">Sem dados</span>';
        const contatoText = n.contato_emergencia ? `<br><small style="color: var(--primary);">📞 ${n.contato_emergencia}</small>` : '';

        return `
            <tr>
                <td>
                    <strong>${user.nome}</strong><br>
                    <small style="color: var(--text-muted);">${user.email}</small>
                </td>
                <td>
                    <span class="user-badge">${user.tipo_usuario}</span><br>
                    <small>${user.turma_setor || 'N/A'}</small>
                </td>
                <td>${badgesHTML}</td>
                <td>${obsText}${contatoText}</td>
                <td class="no-print">
                    <button class="btn btn-secondary btn-sm" onclick="openAdminUserModal(${user.id})">
                        🔍 Ver Ficha
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

window.openAdminUserModal = function(userId) {
    const user = db.usuarios.find(u => u.id === userId);
    if (!user) return;
    const n = db.necessidades[userId] || {};

    const modal = document.getElementById('adminUserModal');
    document.getElementById('modalUserNome').textContent = `Ficha Alimentar: ${user.nome}`;

    const modalBody = document.getElementById('modalUserBody');
    modalBody.innerHTML = `
        <div style="line-height: 1.8;">
            <p><strong>Cargo / Perfil:</strong> ${user.tipo_usuario} (${user.turma_setor || 'Não informado'})</p>
            <p><strong>E-mail:</strong> ${user.email}</p>
            <hr style="margin: 12px 0; border: 0; border-top: 1px solid var(--border);">
            
            <h4 style="margin-bottom: 8px;">Restrições Cadastradas:</h4>
            <ul style="margin-left: 20px; color: var(--text-muted);">
                <li>Intolerância a Lactose: <strong>${n.intolerancia_lactose ? 'SIM 🥛' : 'Não'}</strong></li>
                <li>Restrição a Glúten: <strong>${n.restricao_gluten ? 'SIM 🌾 (Celíaco)' : 'Não'}</strong></li>
                <li>Vegetariano: <strong>${n.vegetariano ? 'SIM 🌱' : 'Não'}</strong></li>
                <li>Vegano: <strong>${n.vegano ? 'SIM 🌿' : 'Não'}</strong></li>
                <li>Diabetes: <strong>${n.diabetes ? 'SIM 🍬' : 'Não'}</strong></li>
                <li>Alergia a Amendoim: <strong>${n.alergia_amendoim ? '⚠️ SIM (ALERTA ANAFILAXIA)' : 'Não'}</strong></li>
                <li>Alergia a Frutos do Mar: <strong>${n.alergia_frutos_mar ? '⚠️ SIM' : 'Não'}</strong></li>
                <li>Alergia a Ovo: <strong>${n.alergia_ovo ? 'SIM 🥚' : 'Não'}</strong></li>
                <li>Alergia a Corantes: <strong>${n.alergia_corantes ? 'SIM 🩸' : 'Não'}</strong></li>
            </ul>

            <hr style="margin: 12px 0; border: 0; border-top: 1px solid var(--border);">
            <p><strong>Outras Alergias:</strong> ${n.outras_alergias || 'Nenhuma'}</p>
            <p><strong>Observações Médicas:</strong> ${n.observacoes_medicas || 'Sem observações declaradas'}</p>
            <p><strong>Contato de Emergência:</strong> <span style="color: var(--primary); font-weight: bold;">${n.contato_emergencia || 'Não informado'}</span></p>
        </div>
    `;

    if (modal) modal.style.display = 'flex';
};

window.closeAdminUserModal = function() {
    const modal = document.getElementById('adminUserModal');
    if (modal) modal.style.display = 'none';
};

// ------------------------------------------------------------
// 11. CONSOLE SQL INTERATIVO
// ------------------------------------------------------------
function initSqlConsole() {
    const runBtn = document.getElementById('btnRunSql');
    const presetSelect = document.getElementById('sqlPresetSelect');
    const textarea = document.getElementById('sqlQueryInput');
    const resultBox = document.getElementById('sqlResultBox');

    const PRESET_QUERIES = {
        'all_usuarios': 'SELECT id, nome, email, tipo_usuario, turma_setor FROM usuarios ORDER BY tipo_usuario, nome;',
        'all_necessidades': 'SELECT u.nome, u.tipo_usuario, u.turma_setor, n.intolerancia_lactose, n.restricao_gluten, n.alergia_amendoim, n.observacoes_medicas FROM usuarios u JOIN necessidades_alimentares n ON u.id = n.usuario_id;',
        'all_pratos': 'SELECT id, nome, categoria, calorias, proteinas FROM pratos ORDER BY calorias DESC;',
        'avg_ratings': 'SELECT prato_id, AVG(nota) AS media_nota, COUNT(id) AS total_votos FROM avaliacoes GROUP BY prato_id;',
        'all_avaliacoes': 'SELECT id, prato_id, nota, categoria, comentario, tipo_usuario, data FROM avaliacoes ORDER BY id DESC;'
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
        if (cleanQuery.includes('from usuarios') && cleanQuery.includes('necessidades')) {
            renderSqlTable(resultBox, ['Nome', 'Tipo Usuário', 'Turma / Setor', 'Lactose?', 'Glúten?', 'Alergia Amendoim?', 'Obs Médica'],
                db.usuarios.map(u => {
                    const n = db.necessidades[u.id] || {};
                    return [u.nome, u.tipo_usuario, u.turma_setor || '-', n.intolerancia_lactose ? 'Sim' : 'Não', n.restricao_gluten ? 'Sim' : 'Não', n.alergia_amendoim ? '⚠️ SIM' : 'Não', n.observacoes_medicas || '-'];
                }));
        }
        else if (cleanQuery.includes('from usuarios')) {
            renderSqlTable(resultBox, ['ID', 'Nome', 'E-mail', 'Tipo Usuário', 'Turma / Setor'],
                db.usuarios.map(u => [u.id, u.nome, u.email, u.tipo_usuario, u.turma_setor || '-']));
        }
        else if (cleanQuery.includes('from necessidades')) {
            renderSqlTable(resultBox, ['ID Usuário', 'Lactose', 'Glúten', 'Vegano', 'Amendoim', 'Obs Médica'],
                Object.values(db.necessidades).map(n => [n.usuario_id, n.intolerancia_lactose ? 'Sim' : 'Não', n.restricao_gluten ? 'Sim' : 'Não', n.vegano ? 'Sim' : 'Não', n.alergia_amendoim ? 'SIM ⚠️' : 'Não', n.observacoes_medicas || '-']));
        }
        else if (cleanQuery.includes('from pratos')) {
            renderSqlTable(resultBox, ['ID', 'Nome', 'Categoria', 'Calorias (kcal)', 'Proteínas (g)', 'Vegano?'],
                db.pratos.map(p => [p.id, p.nome, p.categoria, p.calorias, p.proteinas, p.veg ? 'Sim' : 'Não']));
        } 
        else if (cleanQuery.includes('from avaliacoes')) {
            renderSqlTable(resultBox, ['ID', 'Prato ID', 'Nota (Estrelas)', 'Categoria', 'Comentário', 'Tipo Usuário', 'Data'],
                db.avaliacoes.map(a => [a.id, a.pratoId || 'Geral', `★ ${a.nota}`, a.categoria, a.comentario, a.tipoUsuario, a.data]));
        }
        else {
            renderSqlTable(resultBox, ['Status', 'Mensagem', 'Registros Afetados'], [
                ['OK', 'Query SQL executada com sucesso no motor escolar', db.usuarios.length]
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

// 12. NOTIFICAÇÕES TOAST
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
