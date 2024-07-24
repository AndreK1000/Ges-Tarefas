const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const userId = document.getElementById("userId");

taskForm.addEventListener("submit", addTask);


const userIdInput = document.getElementById("userIdInput");
const fetchUserTasksButton = document.getElementById("fetchUserTasksButton");
const userTaskList = document.getElementById("userTaskList");

fetchUserTasksButton.addEventListener("click", fetchUserTasks);

async function fetchUserTasks() {
    const userId = userIdInput.value.trim();
    if (userId !== "") {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`);
        const tasks = await response.json();
        userTaskList.innerHTML = ""; // Limpa a lista antes de adicionar novas tarefas
        tasks.forEach(task => {
            const li = document.createElement("li");
            const maxText = task.title.length > 35 ? task.title.substring(0, 35) + "..." : task.title;
            li.innerHTML = `
                <span title="${task.title}">${maxText}</span>
                <button class="editButton">Editar</button>
                <button class="deleteButton">Remover</button>
            `;
            userTaskList.appendChild(li);

            li.querySelector(".editButton").addEventListener("click", () => editTask(task.id, li));
            li.querySelector(".deleteButton").addEventListener("click", () => deleteTask(task.id, li));
        });
    }
}


async function fetchTasks() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const tasks = await response.json();
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

async function addTask(event) {
    event.preventDefault();
    const taskText = taskTitle.value.trim();
    const taskDesc = taskDescription.value.trim();
    const user = userId.value.trim();

    if (taskText !== "" && user !== "") {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify({
                title: taskText,
                completed: false,
                userId: user
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        const newTask = await response.json();
        addTaskToDOM(newTask);
        taskForm.reset();
    }
}

function addTaskToDOM(task) {
    const maxText = task.title.length > 35 ? task.title.substring(0, 35) + "..." : task.title;
    const li = document.createElement("li");
    li.innerHTML = `
        <span title="${task.title}">${maxText}</span>
        <button class="editButton">Editar</button>
        <button class="deleteButton">Remover</button>
    `;
    taskList.appendChild(li);

    li.querySelector(".editButton").addEventListener("click", () => editTask(task.id, li));
    li.querySelector(".deleteButton").addEventListener("click", () => deleteTask(task.id, li));
}

async function editTask(id, li) {
    const span = li.querySelector("span");
    const newText = prompt("Editar tarefa:", span.getAttribute("title"));
    if (newText !== null && newText.trim() !== "") {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: newText,
                completed: false,
                userId: 1
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        const updatedTask = await response.json();
        span.textContent = updatedTask.title.length > 35 ? updatedTask.title.substring(0, 35) + "..." : updatedTask.title;
        span.setAttribute("title", updatedTask.title);
    }
}

async function deleteTask(id, li) {
    await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE'
    });
    taskList.removeChild(li);
}


document.addEventListener("DOMContentLoaded", fetchTasks);
