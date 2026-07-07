// DOM Elements Selection
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');

// Local Storage se tasks load karein ya empty array rakhein
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

// App initialization par saved tasks render karein
document.addEventListener('DOMContentLoaded', renderTasks);

// Task Add karne ka logic
function addTask() {
    const taskTitle = todoInput.value.trim();
    
    if (taskTitle === '') {
        alert('Please enter a valid task!');
        return;
    }

    // New task object layout
    const newTask = {
        id: Date.now(), // Unique ID generation
        title: taskTitle,
        completed: false
    };

    tasks.push(newTask);
    saveAndRefresh();
    todoInput.value = ''; // Input clear karein
}

// Event Listeners for Adding Tasks
addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Complete status toggle karne ka logic
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveAndRefresh();
}

// Task Delete karne ka logic
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRefresh();
}

// Local storage updates aur list dynamic creation
function saveAndRefresh() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
}

// UI core rendering engine
function renderTasks() {
    todoList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        
        // HTML Template inside list component
        li.innerHTML = `
            <div class="task-content" onclick="toggleTask(${task.id})">
                <i class="${task.completed ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'} checkbox-icon"></i>
                <span class="task-text">${task.title}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        
        todoList.appendChild(li);
    });

    // Update Remaining Active Tasks Counter
    const activeTasks = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} remaining`;
}