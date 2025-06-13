// DOM Elements
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const columns = document.querySelectorAll('.column');

// Task counter for generating unique IDs
let taskCounter = parseInt(localStorage.getItem('taskCounter') || '0');

// Store the current task being edited
let currentTaskId = null;

// Delete task handling
let taskToDelete = null;
const confirmModal = document.getElementById('confirmModal');

// Make functions globally accessible
window.editTask = editTask;
window.deleteTask = deleteTask;
window.closeModal = closeModal;
window.allowDrop = allowDrop;
window.drop = drop;
window.confirmDelete = confirmDelete;
window.cancelDelete = cancelDelete;

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
    // Set default color selection
    const defaultColor = document.querySelector('input[name="color"][value="blue"]');
    if (defaultColor) defaultColor.checked = true;
});

function setupEventListeners() {
    // Add task button click
    addTaskBtn.addEventListener('click', () => {
        currentTaskId = null;
        document.getElementById('modalTitle').textContent = 'Add New Task';
        openModal();
    });

    // Form submission
    taskForm.addEventListener('submit', handleFormSubmit);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            closeModal();
        }
    });

    // Real-time validation
    const taskTitle = document.getElementById('taskTitle');
    taskTitle.addEventListener('input', () => {
        validateField(taskTitle, 'titleError', 'Please enter a task title');
    });

    // Prevent modal close when clicking modal content
    document.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = getFormData();
    
    if (currentTaskId) {
        // Edit existing task
        updateTask(currentTaskId, formData);
    } else {
        // Create new task
        createTask(formData);
    }

    closeModal();
    saveTasks();
}

function getFormData() {
    return {
        id: currentTaskId || `task-${Date.now()}-${taskCounter++}`,
        title: document.getElementById('taskTitle').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        colorLabel: document.querySelector('input[name="color"]:checked')?.value || 'blue'
    };
}

function createTask(taskData) {
    const task = buildTaskElement(taskData);
    document.querySelector('#todo .task-container').appendChild(task);
    localStorage.setItem('taskCounter', taskCounter.toString());
}

function buildTaskElement(taskData) {
    const task = document.createElement('div');
    task.className = 'task';
    task.id = taskData.id;
    task.draggable = true;

    task.innerHTML = `
        <div class="color-label ${taskData.colorLabel}"></div>
        <h3>${escapeHtml(taskData.title)}</h3>
        <p>${escapeHtml(taskData.description)}</p>
        <div class="task-actions">
            <button type="button" class="edit-btn" onclick="editTask('${taskData.id}')">Edit</button>
            <button type="button" class="delete-btn" onclick="deleteTask('${taskData.id}')">Delete</button>
        </div>
    `;

    task.addEventListener('dragstart', handleDragStart);
    task.addEventListener('dragend', handleDragEnd);

    return task;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function updateTask(taskId, formData) {
    const task = document.getElementById(taskId);
    if (!task) return;

    task.querySelector('h3').textContent = formData.title;
    task.querySelector('p').textContent = formData.description;
    task.querySelector('.color-label').className = `color-label ${formData.colorLabel}`;
}

function editTask(taskId) {
    const task = document.getElementById(taskId);
    if (!task) return;

    currentTaskId = taskId;
    
    // Update modal title
    document.getElementById('modalTitle').textContent = 'Edit Task';

    // Populate form
    document.getElementById('taskTitle').value = task.querySelector('h3').textContent;
    document.getElementById('taskDescription').value = task.querySelector('p').textContent;
    
    // Set color
    const colorLabel = task.querySelector('.color-label').classList[1];
    const colorInput = document.querySelector(`input[name="color"][value="${colorLabel}"]`);
    if (colorInput) colorInput.checked = true;

    openModal();
}

function deleteTask(taskId) {
    const task = document.getElementById(taskId);
    if (!task) return;

    taskToDelete = task;
    
    // Show task preview in confirmation modal
    const taskTitle = task.querySelector('h3').textContent;
    const preview = confirmModal.querySelector('.task-preview');
    preview.textContent = `"${taskTitle}"`;

    // Show confirmation modal
    confirmModal.style.display = 'block';
    setTimeout(() => confirmModal.classList.add('active'), 10);

    // Add fade-out animation to task
    task.style.opacity = '0.5';
    task.style.transform = 'translateX(-10px)';
}

function confirmDelete() {
    if (!taskToDelete) return;

    // Complete fade-out animation
    taskToDelete.style.opacity = '0';
    taskToDelete.style.transform = 'translateX(-20px)';

    setTimeout(() => {
        taskToDelete.remove();
        saveTasks();
        closeConfirmModal();
        taskToDelete = null;
    }, 300);
}

function cancelDelete() {
    if (!taskToDelete) return;

    // Restore task appearance
    taskToDelete.style.opacity = '1';
    taskToDelete.style.transform = 'translateX(0)';
    
    closeConfirmModal();
    taskToDelete = null;
}

function closeConfirmModal() {
    confirmModal.classList.remove('active');
    setTimeout(() => {
        confirmModal.style.display = 'none';
    }, 300);
}

// Add click outside to close for confirmation modal
window.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        cancelDelete();
    }
});

// Modal functions
function openModal() {
    taskForm.reset();
    clearErrors();
    
    // Set default color if none selected
    if (!document.querySelector('input[name="color"]:checked')) {
        const defaultColor = document.querySelector('input[name="color"][value="blue"]');
        if (defaultColor) defaultColor.checked = true;
    }

    taskModal.style.display = 'block';
    setTimeout(() => taskModal.classList.add('active'), 10);
}

function closeModal() {
    currentTaskId = null;
    taskModal.classList.remove('active');
    setTimeout(() => {
        taskModal.style.display = 'none';
        taskForm.reset();
        clearErrors();
    }, 300);
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.classList.remove('visible'));
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
}

// Drag and Drop functions
function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.id);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function allowDrop(e) {
    e.preventDefault();
    const column = e.target.closest('.column');
    if (column) {
        column.classList.add('drag-over');
    }
}

function drop(e) {
    e.preventDefault();
    const column = e.target.closest('.column');
    if (!column) return;

    column.classList.remove('drag-over');
    const taskId = e.dataTransfer.getData('text/plain');
    const task = document.getElementById(taskId);
    if (!task) return;

    const taskContainer = column.querySelector('.task-container');
    taskContainer.appendChild(task);
    saveTasks();
}

// LocalStorage functions
function saveTasks() {
    const boardState = {};
    columns.forEach(column => {
        const columnId = column.id;
        const tasks = Array.from(column.querySelector('.task-container').children).map(task => ({
            id: task.id,
            title: task.querySelector('h3').textContent,
            description: task.querySelector('p').textContent,
            colorLabel: task.querySelector('.color-label').classList[1]
        }));
        boardState[columnId] = tasks;
    });
    localStorage.setItem('kanbanBoard', JSON.stringify(boardState));
}

function loadTasks() {
    const boardState = JSON.parse(localStorage.getItem('kanbanBoard')) || {
        'todo': [],
        'in-progress': [],
        'done': []
    };

    Object.entries(boardState).forEach(([columnId, tasks]) => {
        const column = document.getElementById(columnId);
        if (!column) return;

        const taskContainer = column.querySelector('.task-container');
        taskContainer.innerHTML = ''; // Clear existing tasks
        tasks.forEach(taskData => {
            const task = buildTaskElement(taskData);
            taskContainer.appendChild(task);
        });
    });
}

// Form validation
function validateForm() {
    const taskTitle = document.getElementById('taskTitle');
    const colorSelected = document.querySelector('input[name="color"]:checked');
    
    let isValid = true;

    if (!validateField(taskTitle, 'titleError', 'Please enter a task title')) {
        isValid = false;
    }

    if (!colorSelected) {
        showError('colorError', 'Please select a color label');
        isValid = false;
    } else {
        hideError('colorError');
    }

    if (!isValid) {
        taskForm.classList.add('shake');
        setTimeout(() => taskForm.classList.remove('shake'), 400);
    }

    return isValid;
}

function validateField(field, errorId, errorMessage) {
    if (!field.value.trim()) {
        field.classList.add('error');
        showError(errorId, errorMessage);
        return false;
    }
    field.classList.remove('error');
    hideError(errorId);
    return true;
}

function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
}

function hideError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.remove('visible');
    }
}

// Make functions globally accessible
window.editTask = editTask;
window.deleteTask = deleteTask;
window.closeModal = closeModal;
window.allowDrop = allowDrop;
window.drop = drop; 