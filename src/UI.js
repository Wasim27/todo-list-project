import Project from "./Project";
import Task from "./Task";
import Todo from "./Todo";

let userProjects = new Todo();
let inbox = new Project("Inbox");
userProjects.addProject(inbox);

let menuOpen = false;
let todoOpen = false;

function initialise() {
  const addProject = document.getElementById("sidebar-add-project");
  addProject.addEventListener("click", openAddProject);

  const cancelNewProject = document.getElementById("cancel-add-proj");
  cancelNewProject.addEventListener("click", closeAddProject);

  const addNewProject = document.getElementById("add-new-project");
  addNewProject.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewProj();
  });

  const addTask = document.getElementById("add-todo");
  addTask.addEventListener("click", openAddTodo);

  const cancel = document.getElementById("cancel-task");
  cancel.addEventListener("click", closeAddTodo);

  const addTaskForm = document.getElementById("add-new-task");
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewTask();
  });

  const menuIcon = document.getElementById("menu-icon");
  menuIcon.addEventListener("click", openResponsiveMenu);

  const allTodos = document.querySelectorAll(".todo-list");
  allTodos.forEach((todo) => {
    todo.addEventListener("click", (e) => {
      try {
        const curHeader = document.getElementById("section-heading").innerText;
        const curProj = userProjects.getProject(curHeader);

        if (todoOpen === true) {
          todoOpen = false;
          refreshTasks(curProj);
          return;
        }

        displayTodo(e);
        todoOpen = true;
      } catch (TypeError) {
        return;
      }
    });
  });

  updateProjectSidebar();
}

function displayTodo(e) {
  const curHeader = document.getElementById("section-heading").innerText;
  const curProj = userProjects.getProject(curHeader);

  const todoDetails = curProj.getTodo(e.target.title);
  const todoRef = e.target;

  const displayTodoDiv = document.createElement("div");

  let todoTitle = document.createElement("p");
  let todoDesc = document.createElement("p");
  let todoPriority = document.createElement("p");
  let todoDue = document.createElement("p");

  todoTitle.textContent = `Title: ${todoDetails.title}`;
  todoDesc.textContent = `Description: ${todoDetails.desc}`;
  todoPriority.textContent = `Priority: ${todoDetails.priority}`;
  todoDue.textContent = `Due Date: ${todoDetails.dueDate}`;

  displayTodoDiv.appendChild(todoTitle);
  displayTodoDiv.appendChild(todoDesc);
  displayTodoDiv.appendChild(todoPriority);
  displayTodoDiv.appendChild(todoDue);

  todoRef.appendChild(displayTodoDiv);
}

function openResponsiveMenu() {
  const sidebarContainer = document.getElementById("sidebar-container");
  const mainContainer = document.getElementById("main-content");
  const todoList = document.getElementById("todo-list");

  if (menuOpen === false) {
    sidebarContainer.classList.add("menu-active");
    mainContainer.style.visibility = "hidden";
    todoList.style.visibility = "hidden";
    menuOpen = true;
  } else {
    sidebarContainer.classList.remove("menu-active");
    mainContainer.style.visibility = "visible";
    todoList.style.visibility = "visible";
    menuOpen = false;
  }
}

function openAddProject() {
  const addNewProject = document.getElementById("add-new-project");
  addNewProject.style.transform = "scale(1)";
}

function closeAddProject() {
  const addNewProject = document.getElementById("add-new-project");
  addNewProject.reset();
  addNewProject.style.transform = "scale(0)";
}

function addNewProj() {
  const projectTitle = document.getElementById("title").value;

  if (userProjects.getProject(projectTitle)) {
    alert("Already have project with this name!");
    return;
  }

  if (projectTitle.length <= 16) {
    createNewProject(projectTitle);
    closeAddProject();
  } else {
    alert("Project Names must be a max of 16 characters");
    return;
  }
}

function createNewProject(projTitle) {
  const newProj = new Project(projTitle);
  userProjects.addProject(newProj);
  updateProjectSidebar();
}

function updateProjectSidebar() {
  const projectSidebar = document.getElementById("project-list");
  projectSidebar.innerHTML = "";
  let userProjectsList = userProjects.getProjects();

  userProjectsList.forEach((name, i) => {
    const projectDiv = document.createElement("div");

    const newProjectButton = document.createElement("button");
    newProjectButton.innerText = name.title;
    newProjectButton.title = name.title;
    newProjectButton.classList.add("user-projects");

    let deleteProjBtn = document.createElement("button");
    deleteProjBtn.setAttribute("data-project-number", i);
    deleteProjBtn.id = "delete-proj";

    deleteProjBtn.addEventListener("click", (e) => {
      userProjects.removeProject(e.target.getAttribute("data-project-number"));
      updateProjectSidebar();
      const defaultInbox = document.querySelector('[title="Inbox"]');
      defaultInbox.click();
    });

    projectDiv.appendChild(newProjectButton);
    if (name.title !== "Inbox") {
      projectDiv.appendChild(deleteProjBtn);
    }

    projectSidebar.appendChild(projectDiv);
  });
  loadProjectTasks();
}

function loadProjectTasks() {
  const allProjects = document.querySelectorAll(".user-projects");
  const projectTodoList = document.getElementById("todo-list");
  const sectionHeading = document.getElementById("section-heading");

  allProjects.forEach((project) => {
    project.addEventListener("click", (e) => {
      projectTodoList.innerHTML = "";
      sectionHeading.textContent = e.target.title;

      let curProj = userProjects.getProject(e.target.title);
      refreshTasks(curProj);
    });
  });
}

function refreshTasks(curProj) {
  const projectTodoList = document.getElementById("todo-list");
  projectTodoList.innerHTML = "";
  const loadTasks = curProj.todos;

  loadTasks.forEach((task, i) => {
    const todoDiv = document.createElement("div");
    todoDiv.innerHTML = task.title;
    todoDiv.title = task.title;
    todoDiv.id = "todo";

    let removeTodoBtn = document.createElement("button");
    removeTodoBtn.setAttribute("data-index-number", i);
    removeTodoBtn.id = "delete-todo";

    removeTodoBtn.addEventListener("click", (e) => {
      curProj.removeTodo(e.target.getAttribute("data-index-number"));
      refreshTasks(curProj);
    });

    todoDiv.appendChild(removeTodoBtn);
    projectTodoList.appendChild(todoDiv);
  });
}

function openAddTodo() {
  const taskContainer = document.getElementById("task-container");
  const todoList = document.getElementById("todo-list");
  const addTodoBtn = document.getElementById("add-todo-div");

  taskContainer.classList.add("task-popup-active");
  todoList.style.visibility = "hidden";
  addTodoBtn.style.opacity = "0";
}

function closeAddTodo() {
  const addNewTask = document.getElementById("add-new-task");
  const todoList = document.getElementById("todo-list");
  const taskContainer = document.getElementById("task-container");
  const addTodoBtn = document.getElementById("add-todo-div");

  taskContainer.classList.remove("task-popup-active");
  todoList.style.visibility = "visible";
  addTodoBtn.style.opacity = "1";
  addNewTask.reset();
}

function addNewTask() {
  const curHeader = document.getElementById("section-heading").innerText;
  const curProj = userProjects.getProject(curHeader);

  const taskTitle = document.getElementById("task-title").value;
  const taskDesc = document.getElementById("task-desc").value;
  const taskDue = document.getElementById("task-due").value;
  const taskImportant = document.getElementById("task-priority").checked;

  if (curProj.getTodo(taskTitle)) {
    alert("Cannot have a todo with the same title!");
    return;
  }

  const newTodo = new Task(taskTitle, taskDesc, taskImportant, taskDue);
  curProj.addTodo(newTodo);

  closeAddTodo();
  refreshTasks(curProj);
}

export { initialise };
