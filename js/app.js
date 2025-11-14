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
    if (task.completed) {
      li.style.opacity = '0.6';
    }
    
    li.innerHTML = `
      <div class="d-flex align-items-center flex-grow-1">
        <input type="checkbox" class="form-check-input me-3" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
        <span class="${task.completed ? 'text-decoration-line-through' : ''}">${task.text}</span>
      </div>
      <div>
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteTask(${index})">
          <i class="bi bi-trash-fill"></i>
        </button>
      </div>
    `;
    
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

// Initial render
renderTasks();
