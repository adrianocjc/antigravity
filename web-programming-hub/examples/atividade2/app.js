/**
 * ============================================================================
 * GERENCIADOR DE TAREFAS - JAVASCRIPT DE APLICAÇÃO
 * ============================================================================
 */

// Seletor de Elementos do DOM
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCounter = document.getElementById('task-counter');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

// Estado Global da Aplicação (Busca tarefas salvas ou inicializa lista vazia)
let tasks = JSON.parse(localStorage.getItem('my_academy_tasks')) || [
    { id: 1, text: 'Desenhar layout do card da atividade 1', completed: true },
    { id: 2, text: 'Escrever scripts manipuladores de DOM em JS', completed: false }
];
let currentFilter = 'all';

// Função: Atualizar Contador de Tarefas Pendentes
function updateCounter() {
    const pendings = tasks.filter(t => !t.completed).length;
    taskCounter.textContent = `${pendings} ${pendings === 1 ? 'pendente' : 'pendentes'}`;
}

// Função: Persistir Dados no LocalStorage do Navegador
function saveToStorage() {
    localStorage.setItem('my_academy_tasks', JSON.stringify(tasks));
}

// Função: Renderizar Lista de Tarefas
function renderTasks() {
    // Limpar itens renderizados atualmente
    todoList.innerHTML = '';

    // Filtrar dados baseados no filtro selecionado
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    // Validar caso a lista esteja vazia
    if (filteredTasks.length === 0) {
        todoList.innerHTML = `
            <li class="todo-item" style="justify-content: center; color: var(--text-muted); font-size: 0.85rem;">
                Nenhuma tarefa pendente nesta aba.
            </li>
        `;
        updateCounter();
        return;
    }

    // Criar e injetar elementos na lista
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <div class="todo-item-content" onclick="toggleTaskStatus(${task.id})">
                <i class="${task.completed ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
                <span>${escapeHTML(task.text)}</span>
            </div>
            <button class="btn-delete" onclick="deleteTask(${task.id})" aria-label="Remover tarefa">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        todoList.appendChild(li);
    });

    updateCounter();
}

// Helper para prevenir injeções de HTML maliciosas (XSS)
function escapeHTML(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// Evento: Submissão de Formulário (Adicionar Nova Tarefa)
todoForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir comportamento padrão do navegador de recarregar a página
    
    const taskText = todoInput.value.trim();
    if (!taskText) return;

    // Criar Objeto da Nova Tarefa
    const newTask = {
        id: Date.now(), // Gera um ID único numérico baseado na data
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    todoInput.value = ''; // Limpar input
    
    saveToStorage();
    renderTasks();
});

// Função: Alternar Conclusão da Tarefa (Chamada pelo onclick inline)
window.toggleTaskStatus = function(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveToStorage();
    renderTasks();
};

// Função: Deletar Tarefa (Chamada pelo onclick inline)
window.deleteTask = function(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToStorage();
    renderTasks();
};

// Evento: Limpar todas as Tarefas Concluídas
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveToStorage();
    renderTasks();
});

// Evento: Manipular botões de Filtro
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    });
});

// Inicialização Inicial ao Carregar
renderTasks();
