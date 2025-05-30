document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');

    const showAllBtn = document.getElementById('showAllBtn');
    const showCompletedBtn = document.getElementById('showCompletedBtn');
    const showUncompletedBtn = document.getElementById('showUncompletedBtn');

    let tasks = [];
    try {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            // Ensure each task has all required properties
            tasks = tasks.map(task => ({
                id: task.id || Date.now(),
                title: task.title || '',
                completed: task.completed || false,
                selected: task.selected || false
            }));
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasks = [];
    }
    let currentFilter = 'all'; // 'all', 'completed', 'uncompleted'

    // --- Core Task Functions ---

    const saveTasks = () => {
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
            showTemporaryMessage('Error saving tasks!', 'error');
        }
    };

    const updateDeleteSelectedButton = () => {
        const hasSelectedTasks = tasks.some(task => task.selected);
        deleteSelectedBtn.disabled = !hasSelectedTasks;
    };

    const deleteSelectedTasks = () => {
        const selectedCount = tasks.filter(task => task.selected).length;
        if (selectedCount === 0) return;

        if (confirm(`Are you sure you want to delete ${selectedCount} selected task(s)?`)) {
            tasks = tasks.filter(task => !task.selected);
            saveTasks();
            renderTasks();
            showTemporaryMessage(`Deleted ${selectedCount} task(s)! 🗑️`, 'success');
        }
    };

    const toggleSelectAll = () => {
        const isChecked = selectAllCheckbox.checked;
        tasks.forEach(task => {
            task.selected = isChecked;
        });
        saveTasks();
        renderTasks();
        updateDeleteSelectedButton();
    };

    const toggleTaskSelection = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.selected = !task.selected;
            saveTasks();
            updateDeleteSelectedButton();
            // Update select all checkbox state
            selectAllCheckbox.checked = tasks.every(task => task.selected);
        }
    };

    const renderTasks = () => {
        taskList.innerHTML = ''; // Clear existing tasks
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'completed') return task.completed;
            if (currentFilter === 'uncompleted') return !task.completed;
            return true; // 'all'
        });

        if (filteredTasks.length === 0 && tasks.length > 0) {
            let message = "No tasks to show for this filter.";
            if (currentFilter === 'completed') message = "No tasks completed yet! 👍";
            if (currentFilter === 'uncompleted') message = "All tasks completed! 🎉";
            const emptyStateLi = document.createElement('li');
            emptyStateLi.textContent = message;
            emptyStateLi.style.textAlign = 'center';
            emptyStateLi.style.color = '#888';
            taskList.appendChild(emptyStateLi);
            return;
        }
        if (tasks.length === 0) {
            const emptyStateLi = document.createElement('li');
            emptyStateLi.textContent = "No tasks yet. Add one above! ✨";
            emptyStateLi.style.textAlign = 'center';
            emptyStateLi.style.color = '#888';
            taskList.appendChild(emptyStateLi);
            return;
        }

        filteredTasks.forEach((task, index) => {
            const originalIndex = tasks.findIndex(t => t.id === task.id);
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            if (task.selected) li.classList.add('selected');
            li.dataset.id = task.id;

            const taskContentDiv = document.createElement('div');
            taskContentDiv.className = 'task-content';

            const selectCheckbox = document.createElement('input');
            selectCheckbox.type = 'checkbox';
            selectCheckbox.className = 'select-checkbox';
            selectCheckbox.checked = task.selected;
            selectCheckbox.addEventListener('change', () => toggleTaskSelection(task.id));

            const completeButton = document.createElement('button');
            completeButton.className = 'complete-btn';
            completeButton.innerHTML = task.completed ? '✅' : '⭕';
            completeButton.title = task.completed ? 'Mark as incomplete' : 'Mark as complete';
            completeButton.addEventListener('click', () => {
                toggleComplete(task.id);
                completeButton.innerHTML = !task.completed ? '✅' : '⭕';
                completeButton.title = !task.completed ? 'Mark as incomplete' : 'Mark as complete';
            });

            const span = document.createElement('span');
            span.textContent = task.title;

            taskContentDiv.appendChild(selectCheckbox);
            taskContentDiv.appendChild(completeButton);
            taskContentDiv.appendChild(span);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'actions';

            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️';
            editBtn.className = 'edit-btn';
            editBtn.title = "Edit task";
            editBtn.addEventListener('click', () => editTask(task.id, span));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.className = 'delete-btn';
            deleteBtn.title = "Delete task";
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(taskContentDiv);
            li.appendChild(actionsDiv);
            taskList.appendChild(li);
        });
        updateFilterButtons();
        updateDeleteSelectedButton();
    };

    const addTask = () => {
        const title = taskInput.value.trim();
        if (title === '') {
            showTemporaryMessage('Task title cannot be empty!', 'error', 2000);
            return;
        }
        const newTask = {
            id: Date.now(),
            title: title,
            completed: false,
            selected: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        showTemporaryMessage('Task added successfully! 👍', 'success', 1500);
    };

    const editTask = (id, spanElement) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const newTitle = prompt('Edit task title:', task.title);
        if (newTitle !== null && newTitle.trim() !== '') {
            task.title = newTitle.trim();
            spanElement.textContent = task.title; // Update UI immediately
            saveTasks();
            showTemporaryMessage('Task updated! ✨', 'success');
        } else if (newTitle !== null && newTitle.trim() === '') {
            showTemporaryMessage('Task title cannot be empty.', 'error');
        }
    };

    const deleteTask = (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
            showTemporaryMessage('Task deleted. 🗑️', 'success');
        }
    };

    const toggleComplete = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks(); // Re-render to apply styling and filtering
            if (task.completed) {
                showTemporaryMessage('Task marked as completed! 🎉', 'success', 2000);
            } else {
                showTemporaryMessage('Task marked as uncompleted.', 'info', 2000);
            }
        }
    };

    // --- Filtering ---
    const updateFilterButtons = () => {
        showAllBtn.classList.toggle('active', currentFilter === 'all');
        showCompletedBtn.classList.toggle('active', currentFilter === 'completed');
        showUncompletedBtn.classList.toggle('active', currentFilter === 'uncompleted');
    };

    showAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        renderTasks();
    });

    showCompletedBtn.addEventListener('click', () => {
        currentFilter = 'completed';
        renderTasks();
    });

    showUncompletedBtn.addEventListener('click', () => {
        currentFilter = 'uncompleted';
        renderTasks();
    });


    // --- Temporary Confirmation Message ---
    let messageTimeout;
    const showTemporaryMessage = (message, type = 'success', duration = 3000) => {
        clearTimeout(messageTimeout); // Clear any existing timeout
        confirmationMessage.textContent = message;
        confirmationMessage.className = 'confirmation-message show'; // Reset classes and add 'show'

        if (type === 'error') {
            confirmationMessage.style.backgroundColor = '#e74c3c'; // Red for error
        } else if (type === 'info') {
            confirmationMessage.style.backgroundColor = '#3498db'; // Blue for info
        } else {
            confirmationMessage.style.backgroundColor = '#2ecc71'; // Green for success
        }

        messageTimeout = setTimeout(() => {
            confirmationMessage.classList.remove('show');
        }, duration);
    };

    // --- Hourly Reminder ---
    const checkUncompletedTasks = () => {
        const uncompletedTasks = tasks.filter(task => !task.completed);
        if (uncompletedTasks.length > 0) {
            const message = uncompletedTasks.length === 1
                ? 'You have 1 uncompleted task. Don\'t forget it! ⏰'
                : `You have ${uncompletedTasks.length} uncompleted tasks. Don't forget them! ⏰`;

            // Create a more user-friendly notification
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-icon">⏰</span>
                    <span class="notification-message">${message}</span>
                </div>
                <button class="notification-close">×</button>
            `;

            // Add close button functionality
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                notification.remove();
            });

            // Add to document
            document.body.appendChild(notification);

            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 10000);
        }
    };

    // Set up hourly reminder with proper interval
    let reminderInterval;
    const startHourlyReminder = () => {
        // Clear any existing interval
        if (reminderInterval) {
            clearInterval(reminderInterval);
        }

        // Check immediately on start
        checkUncompletedTasks();

        // Set up hourly check (3600000 milliseconds = 1 hour)
        reminderInterval = setInterval(checkUncompletedTasks, 3600000);
    };

    // Start the reminder when the page loads
    startHourlyReminder();

    // --- Event Listeners ---
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission if any
            addTask();
        }
    });
    selectAllCheckbox.addEventListener('change', toggleSelectAll);
    deleteSelectedBtn.addEventListener('click', deleteSelectedTasks);
    clearAllBtn.addEventListener('click', () => {
        if (tasks.length === 0) {
            showTemporaryMessage('No tasks to clear!', 'info');
            return;
        }

        if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
            tasks = [];
            saveTasks();
            renderTasks();
            showTemporaryMessage('All tasks have been cleared! 🧹', 'success');
        }
    });

    // Initial render
    renderTasks();
});