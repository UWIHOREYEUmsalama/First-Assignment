const todoForm = document.querySelector('#nun');
const todoInput = document.querySelector('#inputd');
const todoList = document.querySelector('#dlist');

let todos = [];

function fetchTodos() {
  fetch('http://localhost:3000/todos')
    .then(response => response.json())
    .then(data => {
      todos = data;
      renderTodos();
    });
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="dtitle">${todo.title}</span>
      <div class="todo-buttons">
        <button class="edit-btn" data-id="${todo.id}">Edit</button>
        <button class="delete-btn" data-id="${todo.id}">Delete</button>
      </div>
    `;
    todoList.appendChild(li);
  });
}

function addTodo() {
  const title = inputd.value.trim();
  if (title === '') {
    return;
  }
  const todo = { title };
  fetch('http://localhost:3000/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  })
    .then(response => response.json())
    .then(data => {
      todos.push(data);
      renderTodos();
    });
    inputd.value = '';
}

function deleteTodo(id) {
  fetch(`http://localhost:3000/todos/${id}`, {
    method: 'DELETE'
  })
    .then(() => {
      todos = todos.filter(todo => todo.id !== id);
      renderTodos();
    });
}

function editTodo() {
  const toTitle = this.parentNode.parentNode.querySelector('.dtitle');
  const newTitle = prompt('Enter new title:', toTitle.innerText);
  if (newTitle === null || newTitle.trim() === '') {
    return;
  }
  const id = parseInt(this.dataset.id);
  const todo = { title: newTitle.trim() };
  fetch(`http://localhost:3000/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  })
    .then(response => response.json())
    .then(data => {
      const toIndex = todos.findIndex(todo => todo.id === id);
      todos[toIndex] = data;
      renderTodos();
    });
}

function saveTodos() {
  todos.forEach(todo => {
    fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo)
    });
  });
}

todoForm.addEventListener('submit', event => {
  event.preventDefault();
  addTodo();
});

todoList.addEventListener('click', event => {
  if (event.target.classList.contains('delete-btn')) {
    const id = parseInt(event.target.dataset.id);
    deleteTodo(id);
  } else if (event.target.classList.contains('edit-btn')) {
    editTodo.call(event.target);
  }
});

fetchTodos();
