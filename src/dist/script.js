"use strict";
const isStringEmpty = (str) => str.trim().length === 0;
const formatDate = (date) => {
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    return `${date.toLocaleTimeString('en-US', options)}, ${date.toLocaleDateString('en-US')}`; // prettier-ignore
};
const tasks = (() => {
    const tasks = [];
    const addTask = (task) => {
        tasks.push(task);
        renderTasks();
    };
    const deleteTask = (id) => {
        const index = tasks.findIndex((task) => task.id === id);
        if (index !== -1) {
            tasks.splice(index, 1);
            renderTasks();
        }
    };
    const editTask = (id) => {
        const task = tasks.find((task) => task.id === id);
        if (task) {
            const newTaskText = prompt('Edit task:', task.task);
            if (newTaskText && !isStringEmpty(newTaskText)) {
                task.task = newTaskText.trim();
                renderTasks();
            }
            else {
                console.warn('Empty task cannot be saved');
            }
        }
    };
    const checkCompletion = (id) => {
        const task = tasks.find((task) => task.id === id);
        if (task) {
            const taskCheckbox = document.querySelector(`.task-checkbox-container input[data-id="${id}"]`); // prettier-ignore
            if (!taskCheckbox) {
                console.error('Missing task checkbox element');
                return;
            }
            const taskName = taskCheckbox.closest('li')?.querySelector('.task-name');
            if (!taskName) {
                console.error('Missing task name element');
                return;
            }
            if (taskCheckbox.checked) {
                taskName.classList.add('completed');
            }
            else {
                taskName.classList.remove('completed');
            }
        }
    };
    const renderTasks = () => {
        const ul = document.querySelector('ul');
        if (!ul) {
            console.error('Missing ul element');
            return;
        }
        ul.innerHTML = '';
        tasks.forEach((task) => {
            const li = document.createElement('li');
            const taskCheckboxContainer = document.createElement('div');
            const taskCheckbox = document.createElement('input');
            const taskContainer = document.createElement('div');
            const taskName = document.createElement('div');
            const taskDate = document.createElement('div');
            const taskButtons = document.createElement('div');
            const deleteButton = document.createElement('button');
            const editButton = document.createElement('button');
            taskCheckbox.type = 'checkbox';
            taskCheckbox.classList.add('task-checkbox');
            taskCheckboxContainer.classList.add('task-checkbox-container');
            taskCheckbox.setAttribute('data-id', task.id.toString());
            taskCheckbox.addEventListener('change', () => checkCompletion(task.id));
            taskCheckboxContainer.appendChild(taskCheckbox);
            taskName.textContent = task.task;
            taskDate.textContent = formatDate(task.date);
            taskName.classList.add('task-name');
            taskDate.classList.add('task-date');
            taskContainer.classList.add('task-container');
            taskContainer.appendChild(taskName);
            taskContainer.appendChild(taskDate);
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('button-7');
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            editButton.textContent = 'Edit';
            editButton.classList.add('button-7');
            editButton.addEventListener('click', () => editTask(task.id));
            taskButtons.classList.add('task-buttons');
            taskButtons.appendChild(deleteButton);
            taskButtons.appendChild(editButton);
            li.appendChild(taskCheckboxContainer);
            li.appendChild(taskContainer);
            li.appendChild(taskButtons);
            ul.appendChild(li);
        });
    };
    return { addTask, deleteTask, editTask, checkCompletion };
})();
const initialize = () => {
    const button = document.querySelector('button');
    const input = document.querySelector('input');
    if (!button || !input) {
        console.error('Missing button or input element');
        return;
    }
    const addTask = () => {
        const taskText = input.value.trim();
        if (!isStringEmpty(taskText)) {
            const todoTask = {
                id: Date.now(),
                task: taskText,
                date: new Date(),
            };
            tasks.addTask(todoTask);
            input.value = '';
        }
        else {
            console.warn('Empty task cannot be added');
        }
    };
    button.addEventListener('click', addTask);
    const keyEnter = (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    };
    input.addEventListener('keydown', keyEnter);
};
document.addEventListener('DOMContentLoaded', initialize);