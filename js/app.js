// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference, user's OS preference, or default to light mode
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

// Apply initial theme
if (currentTheme === 'dark') {
  htmlElement.setAttribute('data-bs-theme', 'dark');
  if (darkModeToggle) {
    darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  }
} else {
  htmlElement.setAttribute('data-bs-theme', 'light');
  if (darkModeToggle) {
    darkModeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
  }
}

// Toggle dark mode
if (darkModeToggle) {
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
}

// To-Do List Functionality
const taskList = document.getElementById('taskList');
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

// Only initialize task functionality if elements exist
if (taskList && newTaskInput && addTaskBtn) {
  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Update dashboard counts
  function updateDashboard() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    
    const todayCount = document.getElementById('todayCount');
    const scheduledCount = document.getElementById('scheduledCount');
    const completedCount = document.getElementById('completedCount');
    const flaggedCount = document.getElementById('flaggedCount');
    
    if (todayCount) todayCount.textContent = activeTasks;
    if (scheduledCount) scheduledCount.textContent = activeTasks;
    if (completedCount) completedCount.textContent = completedTasks;
    if (flaggedCount) flaggedCount.textContent = 0; // Placeholder for future functionality
  }

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
  
  // Update dashboard
  updateDashboard();
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

// Search functionality
const searchForm = document.querySelector('form[role="search"]');
const searchInput = document.querySelector('input[type="search"]');

if (searchForm && searchInput) {
  // Prevent form submission
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  // Real-time search as user types
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    filterTasks(searchTerm);
  });
}

// Filter tasks based on search term
function filterTasks(searchTerm) {
  const taskItems = taskList.querySelectorAll('li');
  
  taskItems.forEach((item) => {
    const taskText = item.querySelector('span').textContent.toLowerCase();
    
    if (taskText.includes(searchTerm)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
  
  // If search is empty, show all tasks
  if (searchTerm === '') {
    taskItems.forEach((item) => {
      item.style.display = '';
    });
  }
}
}
