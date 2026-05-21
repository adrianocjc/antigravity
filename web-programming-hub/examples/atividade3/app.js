/**
 * ============================================================================
 * VITRINE VIRTUAL - JAVASCRIPT DE APLICAÇÃO
 * ============================================================================
 */

// Produtos Estruturados (Mock de API)
const products = [
    { id: 1, name: 'Teclado Mecânico RGB', price: 299.90, img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300&h=200&fit=crop' },
    { id: 2, name: 'Mouse Gamer Pro 16K', price: 159.90, img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&h=200&fit=crop' },
    { id: 3, name: 'Headset Spatial Audio', price: 429.90, img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=200&fit=crop' },
    { id: 4, name: 'Mousepad Gamer Extended', price: 89.90, img: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=300&h=200&fit=crop' }
];

// Carrinho de Compras (Estado da Aplicação)
let cart = [];

// Seleção de Componentes do DOM
const productGrid = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartCounter = document.getElementById('cart-counter');
const summaryQty = document.getElementById('summary-qty');
const summaryTotal = document.getElementById('summary-total');
const checkoutBtn = document.getElementById('checkout-btn');
const searchInput = document.getElementById('search-input');

// Função: Renderizar Produtos no Grid
function renderCatalog(filterText = '') {
    productGrid.innerHTML = '';
    
    // Filtrar produtos baseados no texto de busca (case-insensitive)
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-gray); padding: 2rem;">
                Nenhum periférico encontrado com este nome.
            </div>
        `;
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}" class="product-img">
            <h3 class="product-name">${p.name}</h3>
            <p class="product-price">R$ ${p.price.toFixed(2).replace('.', ',')}</p>
            <button class="btn-add" onclick="addToCart(${p.id})">Adicionar ao Carrinho</button>
        `;
        productGrid.appendChild(card);
    });
}

// Função: Atualizar painel do Carrinho e Cálculos
function updateCartUI() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-gray); font-size: 0.85rem; padding: 1.5rem 0;">
                Seu carrinho está vazio.
            </div>
        `;
        cartCounter.textContent = '0';
        summaryQty.textContent = '0';
        summaryTotal.textContent = 'R$ 0,00';
        checkoutBtn.disabled = true;
        return;
    }

    // Gerar elementos para cada item
    cart.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';
        itemRow.innerHTML = `
            <div>
                <span class="cart-item-name">${item.name}</span>
                <div style="color: var(--text-gray); font-size: 0.75rem;">Qty: ${item.qty}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <strong>R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</strong>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remover item">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(itemRow);
    });

    // Calcular valores agregados usando métodos funcionais (Array.reduce)
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    cartCounter.textContent = totalQty;
    summaryQty.textContent = totalQty;
    summaryTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    checkoutBtn.disabled = false;
}

// Função: Adicionar ao Carrinho (Chamada pelo onclick inline)
window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
};

// Função: Remover do Carrinho (Chamada pelo onclick inline)
window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
};

// Evento: Filtrar ao Digitar na Barra de Pesquisa
searchInput.addEventListener('input', (e) => {
    renderCatalog(e.target.value);
});

// Evento: Checkout Final de Compras
checkoutBtn.addEventListener('click', () => {
    alert('Simulação de Compra Finalizada!\nObrigado por testar o catálogo DevStore.');
    cart = [];
    updateCartUI();
});

// Inicialização Inicial ao Carregar
renderCatalog();
updateCartUI();
