// ローカルストレージからToDoリストを読み込む
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// ページ読み込み時にToDoリストを表示
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    
    // Enterキーでタスク追加
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});

// ToDoを追加ｇ
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (text === '') {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
        return;
    }
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.unshift(todo);
    saveTodos();
    renderTodos();
    input.value = '';
    input.focus();
}

// ToDoの完了状態を切り替え
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

// ToDoを削除
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// 完了済みのToDoを削除
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

// フィルターを適用
function filterTodos(filter) {
    currentFilter = filter;
    
    // フィルターボタンのアクティブ状態を更新
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTodos();
}

// フィルター済みのToDoを取得
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// ToDoリストを描画
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <li style="text-align: center; padding: 40px; color: #888;">
                ${currentFilter === 'all' ? 'タスクがありません' : 
                  currentFilter === 'active' ? '未完了のタスクはありません' : 
                  '完了したタスクはありません'}
            </li>
        `;
    } else {
        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''} 
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})" title="削除">
                    ✕
                </button>
            </li>
        `).join('');
    }
    
    updateItemCount();
}

// タスク数を更新
function updateItemCount() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    const totalCount = todos.length;
    document.getElementById('itemCount').textContent = 
        `${activeCount} 件の未完了 / 全 ${totalCount} 件`;
}

// ローカルストレージに保存
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// HTMLエスケープ（XSS対策）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 入力フィールドのシェイクアニメーション用CSS追加
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    .shake {
        animation: shake 0.3s ease;
        border-color: #e74c3c !important;
    }
`;
document.head.appendChild(style);
