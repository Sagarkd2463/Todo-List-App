//getting all the references
const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

//setting global variables
let editId, 
isEditTask = false,
todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => { //adding an event loop to all filters
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) { //function to the status of the list 
    let liTag = "";
    if(todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all"){  //adding functions 
                liTag += `
                <li class="task">
                <label for="${id}">
                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                <p class=${completed}> ${todo.name}</p> </label>
                <div class="settings">
                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                <ul class="task-menu">
                <li onclick='editTask(${id}, "${todo.name}")'> <i class="uil uil-pen"></i> Edit </li>
                <li onclick='deleteTask(${id}, "${filter}")'> <i class="uil uil-trash"></i> Delete </li>
                </ul>
                </div>
                </li>`
            }
        });
    }

    taskBox.innerHTML = liTag || `<span> You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}

showTodo("all");

function showMenu(selectedTask) { 
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", (e) => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

//updating status when selected task is checked or not 
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

//fetching id of the task to edit the task 
function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

//deleting a task by its id
function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

//making todo-list empty by clearing all tasks
clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
});

taskInput.addEventListener("keyup", (e) => {
    let userTask = taskInput.value.trim(); //taking user input 
    if(e.key == "Enter" && userTask) {
        if(!isEditTask) { //todo list is set to pending if user adds any task 
            todos = !todos ? [] : todos;
            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo);
        } else { 
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});

