// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
  htmlElement.setAttribute('data-bs-theme', 'dark');
  darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
  const theme = htmlElement.getAttribute('data-bs-theme');
  if (theme === 'dark') {
    htmlElement.setAttribute('data-bs-theme', 'light');
    darkModeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
    localStorage.setItem('theme', 'light');
  } else {
    htmlElement.setAttribute('data-bs-theme', 'dark');
    darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    localStorage.setItem('theme', 'dark');
  }
});

// To-Do List Functionality
const taskList = document.getElementById('taskList');
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-start';
    li.dataset.index = index;
    if (task.completed) {
      li.style.opacity = '0.6';
    }
    
    const container = document.createElement('div');
    container.className = 'd-flex align-items-center flex-grow-1';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input me-3';
    checkbox.checked = task.completed;
    
    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) {
      span.className = 'text-decoration-line-through';
    }
    
    container.appendChild(checkbox);
    container.appendChild(span);
    
    const buttonDiv = document.createElement('div');
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn-outline-danger btn-sm';
    deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
    
    buttonDiv.appendChild(deleteBtn);
    
    li.appendChild(container);
    li.appendChild(buttonDiv);
    taskList.appendChild(li);
  });
  
  // Save tasks to localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add new task
function addTask() {
  const taskText = newTaskInput.value.trim();
  if (taskText !== '') {
    tasks.push({ text: taskText, completed: false });
    newTaskInput.value = '';
    renderTasks();
  }
}

// Toggle task completion
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Event delegation for task list
taskList.addEventListener('change', (e) => {
  if (e.target.type === 'checkbox') {
    const li = e.target.closest('li');
    const index = parseInt(li.dataset.index);
    toggleTask(index);
  }
});

taskList.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.btn-outline-danger');
  if (deleteBtn) {
    const li = deleteBtn.closest('li');
    const index = parseInt(li.dataset.index);
    deleteTask(index);
  }
});

// Initial render
renderTasks();
