/**
 * ============================================================================
 * WEB DEV HUB & PLAYGROUND - CORE LOGIC
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initSandbox();
});

/* ==========================================================================
   TAB NAVIGATION (MAIN DASHBOARD)
   ========================================================================== */
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');

            // Toggle active sidebar link
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Toggle active tab content pane
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });

            // Smooth scroll top on change
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // If entering sandbox, run standard render once
            if (targetTab === 'sandbox') {
                runSandbox();
            }
        });
    });
}

/* ==========================================================================
   CODE VIEWERS (SUB-TABS INSIDE ACTIVITIES)
   ========================================================================== */
window.switchCodeTab = function(btn, fileType) {
    const container = btn.closest('.code-viewer-container');
    const tabBtns = container.querySelectorAll('.code-tab-btn');
    const codeBlocks = container.querySelectorAll('.code-block');

    // Toggle Button States
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Toggle Content block visible
    codeBlocks.forEach(block => {
        block.classList.remove('active');
        if (block.classList.contains(`code-${fileType}`)) {
            block.classList.add('active');
        }
    });
};

/* ==========================================================================
   COPY TO CLIPBOARD UTILITY
   ========================================================================== */
window.copyCode = function(btn) {
    const container = btn.closest('.code-viewer-container');
    const activeBlock = container.querySelector('.code-block.active code');
    if (!activeBlock) return;

    const textToCopy = activeBlock.textContent;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            // Visual success feedback
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #4ade80;"></i> Copiado!`;
            btn.style.borderColor = '#4ade80';
            btn.style.color = '#4ade80';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 1800);
        })
        .catch(err => {
            console.error('Falha ao copiar: ', err);
            alert('Não foi possível copiar o código automaticamente.');
        });
};

/* ==========================================================================
   LIVE SANDBOX PLAYGROUND
   ========================================================================== */
let activeEditor = 'html';

function initSandbox() {
    // Listen for inputs to auto-render (with a small debounce or manual triggers)
    const textareas = ['sandbox-html-code', 'sandbox-css-code', 'sandbox-js-code'];
    textareas.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // Trigger compile on keyboard typing
            el.addEventListener('input', () => {
                // Auto compile on changes
                runSandbox();
            });
        }
    });
}

// Switch between editor textareas inside Sandbox
window.switchEditorTab = function(editorType) {
    activeEditor = editorType;

    // Toggle Button States
    const btns = document.querySelectorAll('.editor-tab-btn');
    btns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-editor') === editorType) {
            btn.classList.add('active');
        }
    });

    // Toggle Textarea Container visible
    const containers = document.querySelectorAll('.editor-textarea-container');
    containers.forEach(container => {
        container.classList.remove('active');
        if (container.id === `editor-${editorType}-container`) {
            container.classList.add('active');
        }
    });
};

// Render User Code in Iframe
window.runSandbox = function() {
    const previewFrame = document.getElementById('sandbox-preview-frame');
    if (!previewFrame) return;

    const htmlCode = document.getElementById('sandbox-html-code').value;
    const cssCode = document.getElementById('sandbox-css-code').value;
    const jsCode = document.getElementById('sandbox-js-code').value;

    // Build self-contained source document
    const source = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                /* Normalize inside the preview */
                * { box-sizing: border-box; }
                body { margin: 0; padding: 1.5rem; font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: #1e293b; }
                /* Inject user css */
                ${cssCode}
            </style>
        </head>
        <body>
            <!-- Inject user html -->
            ${htmlCode}

            <!-- Inject user javascript with error trapping -->
            <script>
                window.addEventListener('DOMContentLoaded', () => {
                    try {
                        ${jsCode}
                    } catch (error) {
                        console.error('Erro no Sandbox:', error);
                        // Inject visual error banner
                        const errorDiv = document.createElement('div');
                        errorDiv.style.background = '#fef2f2';
                        errorDiv.style.border = '1px solid #fee2e2';
                        errorDiv.style.borderRadius = '8px';
                        errorDiv.style.color = '#991b1b';
                        errorDiv.style.padding = '1rem';
                        errorDiv.style.marginTop = '1.5rem';
                        errorDiv.style.fontFamily = 'monospace';
                        errorDiv.style.fontSize = '0.9rem';
                        errorDiv.innerHTML = '<strong>❌ Erro no JavaScript:</strong><br><span style="margin-top: 0.5rem; display: inline-block;">' + error.message + '</span>';
                        document.body.appendChild(errorDiv);
                    }
                });
            </script>
        </body>
        </html>
    `;

    // Write directly to frame
    previewFrame.srcdoc = source;
};

// Clear all Sandbox editors
window.clearSandbox = function() {
    if (confirm('Deseja limpar todos os editores do Sandbox?')) {
        document.getElementById('sandbox-html-code').value = '';
        document.getElementById('sandbox-css-code').value = '';
        document.getElementById('sandbox-js-code').value = '';
        runSandbox();
    }
};

/* ==========================================================================
   PRE-LOAD ACTIVITY CODES INTO SANDBOX
   ========================================================================== */

// Database dictionary of templates corresponding to activities
const activityTemplates = {
    atividade1: {
        html: `<!-- Card de Perfil Profissional -->
<article class="profile-card">
    <header class="card-header">
        <div class="avatar-container">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" alt="Foto de Mariana" class="avatar">
        </div>
    </header>

    <section class="card-body">
        <h1 class="name">Ana Silva</h1>
        <p class="title">Desenvolvedora Front-End Senior</p>
        <p class="bio">Apaixonada por CSS moderno, animações fluidas e arquitetura de interfaces focada na usabilidade e acessibilidade.</p>
    </section>

    <footer class="card-footer">
        <a href="#" class="social-btn github" aria-label="Github"><i class="fa-brands fa-github"></i></a>
        <a href="#" class="social-btn linkedin" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
        <a href="#" class="social-btn twitter" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
    </footer>
</article>`,
        css: `/* Estilos do Card de Perfil */
:root {
    --primary: #6366f1;
    --text-main: #1e293b;
    --text-muted: #64748b;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
}

.profile-card {
    background: #ffffff;
    width: 100%;
    max-width: 320px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    text-align: center;
    transition: var(--transition);
}

.profile-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px rgba(0,0,0,0.1);
}

.card-header {
    background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
    height: 100px;
    position: relative;
    margin-bottom: 50px;
}

.avatar-container {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
}

.avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #ffffff;
}

.card-body {
    padding: 0 1.5rem 1.5rem 1.5rem;
}

.name {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--text-main);
}

.title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--primary);
    text-transform: uppercase;
    margin-top: 0.25rem;
    margin-bottom: 0.75rem;
}

.bio {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.5;
}

.card-footer {
    background: #f8fafc;
    padding: 1rem 1.5rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.social-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    color: var(--text-muted);
    text-decoration: none;
    transition: var(--transition);
}

.social-btn:hover {
    color: #ffffff;
    transform: scale(1.1);
}
.social-btn.github:hover { background: #1f2328; }
.social-btn.linkedin:hover { background: #0a66c2; }
.social-btn.twitter:hover { background: #1d9bf0; }`,
        js: `// Não requer JS para este exemplo visual estático.
console.log("Card de perfil estilizado com sucesso!");`
    },
    atividade2: {
        html: `<!-- Gerenciador de Tarefas -->
<main class="todo-container">
    <header class="todo-header">
        <h1><i class="fa-solid fa-list-check"></i> Minhas Tarefas</h1>
        <p>Organize suas atividades diárias acadêmicas</p>
    </header>

    <form id="todo-form" class="todo-form">
        <input type="text" id="todo-input" placeholder="Nova tarefa para estudar..." required maxlength="60">
        <button type="submit"><i class="fa-solid fa-plus"></i></button>
    </form>

    <div class="filters">
        <button class="filter-btn active" data-filter="all">Todas</button>
        <button class="filter-btn" data-filter="pending">Pendentes</button>
        <button class="filter-btn" data-filter="completed">Concluídas</button>
    </div>

    <ul id="todo-list" class="todo-list">
        <!-- Inserção via JS -->
    </ul>

    <footer class="todo-footer">
        <span id="task-counter">0 pendentes</span>
        <button id="clear-completed" class="clear-btn">Limpar Concluídas</button>
    </footer>
</main>`,
        css: `/* Estilos do To-Do List */
:root {
    --primary: #4f46e5;
    --primary-hover: #4338ca;
    --text-primary: #1e293b;
    --text-muted: #64748b;
    --border: #e2e8f0;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background: #f1f5f9;
}

.todo-container {
    background: #ffffff;
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.todo-header h1 {
    font-size: 1.3rem;
    color: var(--primary);
    margin: 0;
}
.todo-header p { font-size: 0.8rem; color: var(--text-muted); margin: 2px 0 0 0; }

.todo-form { display: flex; gap: 0.5rem; }
.todo-form input {
    flex: 1; padding: 0.6rem 0.85rem; border: 1px solid var(--border);
    border-radius: 8px; font-size: 0.9rem; outline: none;
}
.todo-form input:focus { border-color: var(--primary); }
.todo-form button {
    background: var(--primary); color: white; border: none;
    width: 38px; height: 38px; border-radius: 8px; cursor: pointer;
}

.filters { display: flex; gap: 0.4rem; }
.filter-btn {
    background: #f8fafc; border: 1px solid var(--border); color: var(--text-muted);
    padding: 0.35rem 0.75rem; border-radius: 15px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
}
.filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }

.todo-list { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; padding: 0; }
.todo-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.6rem 0.85rem; background: #f8fafc; border: 1px solid var(--border); border-radius: 8px;
}
.todo-item-content { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; flex: 1; }
.todo-item.completed .todo-item-content span { text-decoration: line-through; color: var(--text-muted); }
.todo-item.completed .todo-item-content i { color: #22c55e; }

.btn-delete { background: transparent; border: none; color: #ef4444; cursor: pointer; }
.todo-footer { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 0.75rem; }
.clear-btn { background: transparent; border: none; color: #ef4444; cursor: pointer; }`,
        js: `// JavaScript da Lista de Tarefas
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const counter = document.getElementById('task-counter');
const clearBtn = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.filter-btn');

let items = [
    { id: 1, text: 'Revisar sintaxe do CSS Grid', completed: false },
    { id: 2, text: 'Escrever função map() em JS', completed: true }
];
let activeFilter = 'all';

function render() {
    list.innerHTML = '';
    const filtered = items.filter(i => {
        if (activeFilter === 'pending') return !i.completed;
        if (activeFilter === 'completed') return i.completed;
        return true;
    });

    filtered.forEach(i => {
        const li = document.createElement('li');
        li.className = \`todo-item \${i.completed ? 'completed' : ''}\`;
        li.innerHTML = \`
            <div class="todo-item-content" onclick="toggleStatus(\${i.id})">
                <i class="\${i.completed ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
                <span>\${i.text}</span>
            </div>
            <button class="btn-delete" onclick="removeItem(\${i.id})"><i class="fa-solid fa-trash-can"></i></button>
        \`;
        list.appendChild(li);
    });

    const pendingQty = items.filter(i => !i.completed).length;
    counter.textContent = \`\${pendingQty} pendente\${pendingQty !== 1 ? 's' : ''}\`;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    items.push({ id: Date.now(), text, completed: false });
    input.value = '';
    render();
});

window.toggleStatus = function(id) {
    items = items.map(i => i.id === id ? { ...i, completed: !i.completed } : i);
    render();
};

window.removeItem = function(id) {
    items = items.filter(i => i.id !== id);
    render();
};

clearBtn.addEventListener('click', () => {
    items = items.filter(i => !i.completed);
    render();
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        activeFilter = e.target.getAttribute('data-filter');
        render();
    });
});

render();`
    },
    atividade3: {
        html: `<!-- Vitrine Virtual com Carrinho -->
<header class="nav-bar">
    <div class="nav-brand"><i class="fa-solid fa-laptop-code"></i> DevStore</div>
    <div class="search-box">
        <input type="text" id="search-input" placeholder="Pesquisar periféricos...">
        <i class="fa-solid fa-magnifying-glass"></i>
    </div>
    <button class="cart-trigger">
        <i class="fa-solid fa-basket-shopping"></i>
        <span id="cart-counter" class="cart-counter">0</span>
    </button>
</header>

<div class="main-layout">
    <section class="catalog">
        <h2 class="section-title">Equipamentos em Destaque</h2>
        <div class="product-grid" id="product-grid">
            <!-- Grid preenchido via JS -->
        </div>
    </section>

    <aside class="cart-panel">
        <h2 class="cart-title"><i class="fa-solid fa-bag-shopping"></i> Carrinho</h2>
        <div class="cart-items" id="cart-items"></div>
        <div class="cart-summary">
            <div class="summary-row">
                <span>Itens:</span>
                <span id="summary-qty">0</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span id="summary-total">R$ 0,00</span>
            </div>
            <button class="btn-checkout" id="checkout-btn" disabled onclick="checkout()">Finalizar</button>
        </div>
    </aside>
</div>`,
        css: `/* Estilos da Vitrine */
:root {
    --primary: #0ea5e9;
    --bg-main: #f8fafc;
    --border: #e2e8f0;
}

body {
    background: var(--bg-main);
    margin: 0;
    padding: 0;
}

.nav-bar {
    background: #ffffff;
    border-bottom: 1px solid var(--border);
    padding: 0.75rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand { font-weight: 800; color: var(--primary); font-size: 1.2rem; }
.search-box { position: relative; width: 100%; max-width: 250px; }
.search-box input {
    width: 100%; padding: 0.5rem 0.5rem 0.5rem 2rem;
    border: 1px solid var(--border); border-radius: 20px; outline: none; font-size: 0.85rem;
}
.search-box i { position: absolute; left: 0.75rem; top: 32%; color: #94a3b8; font-size: 0.8rem; }

.cart-trigger {
    background: #f0f9ff; border: 1px solid rgba(14, 165, 233, 0.2);
    color: var(--primary); width: 36px; height: 36px; border-radius: 50%;
    position: relative; display: flex; justify-content: center; align-items: center; cursor: pointer;
}
.cart-counter {
    position: absolute; top: -5px; right: -5px; background: #ef4444; color: white;
    font-size: 0.65rem; font-weight: bold; width: 16px; height: 16px; border-radius: 50%;
    display: flex; justify-content: center; align-items: center;
}

.main-layout {
    max-width: 1000px; margin: 1.5rem auto; padding: 0 1rem;
    display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem;
}

.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
.product-card {
    background: white; border: 1px solid var(--border); border-radius: 10px; padding: 1rem;
    display: flex; flex-direction: column; gap: 0.5rem; transition: transform 0.2s;
}
.product-card:hover { transform: translateY(-3px); }
.product-img { width: 100%; height: 110px; object-fit: cover; border-radius: 6px; }
.product-name { font-size: 0.9rem; font-weight: 600; margin: 0; }
.product-price { font-size: 1rem; font-weight: 700; color: var(--primary); margin: 0; }
.btn-add { background: var(--primary); color: white; border: none; padding: 0.5rem; border-radius: 6px; font-weight: bold; cursor: pointer; }

.cart-panel { background: white; border: 1px solid var(--border); border-radius: 10px; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; align-self: flex-start; }
.cart-title { font-size: 1rem; margin: 0; }
.cart-items { max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; }
.cart-item { display: flex; justify-content: space-between; font-size: 0.8rem; background: #f8fafc; padding: 0.4rem; border-radius: 4px; }
.cart-item-remove { background: transparent; border: none; color: #ef4444; cursor: pointer; }

.cart-summary { border-top: 1px solid var(--border); padding-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
.summary-row { display: flex; justify-content: space-between; font-size: 0.85rem; }
.summary-row.total { font-weight: bold; font-size: 0.95rem; }
.btn-checkout { background: #22c55e; color: white; border: none; padding: 0.6rem; border-radius: 6px; font-weight: bold; width: 100%; cursor: pointer; }
.btn-checkout:disabled { background: #cbd5e1; cursor: not-allowed; }`,
        js: `// Lógica da Vitrine e Carrinho
const products = [
    { id: 1, name: 'Teclado Gamer', price: 299.90, img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=200&h=120&fit=crop' },
    { id: 2, name: 'Mouse Gamer', price: 159.90, img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&h=120&fit=crop' },
    { id: 3, name: 'Mousepad Extended', price: 89.90, img: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=200&h=120&fit=crop' }
];

let cart = [];

const grid = document.getElementById('product-grid');
const itemsContainer = document.getElementById('cart-items');
const counter = document.getElementById('cart-counter');
const qtyLabel = document.getElementById('summary-qty');
const totalLabel = document.getElementById('summary-total');
const checkoutBtn = document.getElementById('checkout-btn');
const search = document.getElementById('search-input');

function render(filter = '') {
    grid.innerHTML = '';
    const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
    
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = \`
            <img src="\${p.img}" alt="\${p.name}" class="product-img">
            <h3 class="product-name">\${p.name}</h3>
            <p class="product-price">R$ \${p.price.toFixed(2)}</p>
            <button class="btn-add" onclick="buy(\${p.id})">Adicionar</button>
        \`;
        grid.appendChild(card);
    });
}

function updateCart() {
    itemsContainer.innerHTML = '';
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<div style="text-align:center; color:#94a3b8; font-size:0.75rem;">Vazio</div>';
        counter.textContent = '0';
        qtyLabel.textContent = '0';
        totalLabel.textContent = 'R$ 0,00';
        checkoutBtn.disabled = true;
        return;
    }

    cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = \`
            <div>\${item.name} (x\${item.qty})</div>
            <div>
                <strong>R$ \${(item.price * item.qty).toFixed(2)}</strong>
                <button class="cart-item-remove" onclick="remove(\${item.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        \`;
        itemsContainer.appendChild(row);
    });

    const totalQty = cart.reduce((acc, i) => acc + i.qty, 0);
    const totalPrice = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

    counter.textContent = totalQty;
    qtyLabel.textContent = totalQty;
    totalLabel.textContent = \`R$ \${totalPrice.toFixed(2)}\`;
    checkoutBtn.disabled = false;
}

window.buy = function(id) {
    const prod = products.find(p => p.id === id);
    const exist = cart.find(i => i.id === id);
    if (exist) { exist.qty += 1; } else { cart.push({ ...prod, qty: 1 }); }
    updateCart();
};

window.remove = function(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
};

search.addEventListener('input', (e) => render(e.target.value));

window.checkout = function() {
    alert('Compra realizada com sucesso!');
    cart = [];
    updateCart();
};

render();
updateCart();`
    }
};

// Function: Loads selected activity templates into Sandbox
window.activityLoadedAlert = false;
window.loadActivityToSandbox = function(activityKey) {
    const template = activityTemplates[activityKey];
    if (!template) {
        alert('Este exemplo específico não é carregável diretamente no Sandbox (Atividade PHP/MySQL requer servidor local).');
        return;
    }

    // Set textarea values
    document.getElementById('sandbox-html-code').value = template.html;
    document.getElementById('sandbox-css-code').value = template.css;
    document.getElementById('sandbox-js-code').value = template.js;

    // Navigate to Sandbox Tab programmatically
    const sandboxNavItem = document.querySelector('.nav-item[data-tab="sandbox"]');
    if (sandboxNavItem) {
        sandboxNavItem.click(); // Fires active item changes & render
    }
};
