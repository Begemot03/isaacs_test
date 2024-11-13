const api = "http://localhost:8000/api";
const authApi = `${api}/auth`;
const taskApi = `${api}/task`;

const TASK_COMPLETE = "complete";
const TASK_PENDING = "pending";

window.onload = main;

window.isAuth = false;

async function main() {
  await ConfigureAuth();
  configureNavbar();
  configureModals();
}

async function ConfigureAuth() {
  const response = await fetch(`${authApi}/check`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const isAuth = await response.json();
  window.isAuth = isAuth.result;

  await getTasks();
}

function configureNavbar() {
  if (window.isAuth) navbarOnAuth();
  else navbarOnNoAuth();
}

function navbarOnNoAuth() {
  const nav = document.querySelector(".nav");
  const registrationBtn = createNavItem("Зарегистрироваться", ["registration"]);
  const loginBtn = createNavItem("Войти", ["login"]);

  registrationBtn.addEventListener("click", openRegistrationModal);
  loginBtn.addEventListener("click", openLoginModal);

  nav.innerHTML = "";
  nav.appendChild(registrationBtn);
  nav.appendChild(loginBtn);
}

function navbarOnAuth() {
  const nav = document.querySelector(".nav");
  const logoutBtn = createNavItem("Выйти", ["logout"]);

  logoutBtn.addEventListener("click", logout);

  nav.innerHTML = "";
  nav.appendChild(logoutBtn);
}

function createNavItem(text, classes = []) {
  const navItem = document.createElement("span");

  navItem.textContent = text;
  navItem.classList.add("nav__item", ...classes);

  return navItem;
}

function configureModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      e.preventDefault();

      modal.classList.add("hidden");
    });

    modal.querySelector(".modal__content").addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });
}

function openRegistrationModal() {
  openAuthModal("Регистрация", "Зарегистрироваться", registration);
}

function openLoginModal() {
  openAuthModal("Вход", "Войти", login);
}

function openAuthModal(title, btnText, formCb) {
  const modal = document.querySelector(".auth-modal");

  modal.classList.remove("hidden");
  modal.querySelector(".form").onsubmit = null;
  modal.querySelector(".form").onsubmit = (e) => formCb(e);
  modal.querySelector(".modal__content-title").textContent = title;
  modal.querySelector(".btn").textContent = btnText;
}

function closeAuthModal() {
  document.querySelector(".auth-modal").classList.add("hidden");
}

function auth() {
  window.isAuth = true;
  navbarOnAuth();
  closeAuthModal();
  getTasks();
}

async function registration(e) {
  e.preventDefault();

  const formEl = document.querySelector(".auth-modal .form");
  const formData = new FormData(formEl);
  const formObj = Object.fromEntries(formData.entries());

  const response = await fetch(`${authApi}/registration`, {
    method: "POST",
    body: JSON.stringify(formObj),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    auth();
  }
}

async function login(e) {
  e.preventDefault();

  const formEl = document.querySelector(".auth-modal .form");
  const formData = new FormData(formEl);
  const formObj = Object.fromEntries(formData.entries());

  const response = await fetch(`${authApi}/login`, {
    method: "POST",
    body: JSON.stringify(formObj),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    console.log("login");
    auth();
  }
}

async function logout() {
  window.isAuth = false;
  navbarOnNoAuth();

  await fetch(`${authApi}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  await getTasks();
}

async function getTasks() {
  const response = await fetch(taskApi, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const tasks = await response.json();
  showTasks(tasks);
}

function showTasks(tasks) {
  if (!window.isAuth) {
    createNoAuthTaskList();
    return;
  }

  if ((tasks.length == 0)) {
    createEmptyTaskList();
    return;
  }

  createTaskList(tasks);
}

function createEmptyTaskList() {
  const taskList = document.querySelector(".task-list");

  taskList.innerHTML = `
		<div class="task-list__item-empty">
			Задач пока нет
		</div>`;
}

function createNoAuthTaskList() {
  const taskList = document.querySelector(".task-list");

  taskList.innerHTML = `
		<div class="task-list__item-empty">
			Войдите или зарегистрируйтесь, чтобы создавать задачи
		</div>
	`;
}

function createTaskList(tasks) {
  const taskList = document.querySelector(".task-list");

  taskList.innerHTML = "";

  for(let task of tasks) {
	const taskNode = htmlToNode(taskItemHtml());
	taskNode.querySelector(".task-list__item-title").textContent = task.title;
	taskNode.querySelector(".task-list__item-creationTS").textContent = task.creationTS;

	const checkbox = taskNode.querySelector(".task-list__item-status");
	checkbox.checked = task.status == TASK_COMPLETE;
	checkbox.addEventListener("change", (e) => checkTask(e, task));

	taskNode.querySelector(".task-list__item-delete").addEventListener("click", (e) => deleteTask(task));
	taskNode.querySelector(".task-list__item-edit").addEventListener("click", (e) => openEditTaskModal(task));
	taskList.appendChild(taskNode);
  }
}

async function checkTask(e, task) {
	const status = e.target.checked ? TASK_COMPLETE : TASK_PENDING;

	await fetch(`${taskApi}/${task.id}`, {
		method: "PUT",
		body: JSON.stringify({
			title: task.title,
			status,
		})
	});

	getTasks();
}

async function deleteTask(task) {
	await fetch(`${taskApi}/${task.id}`, {
		method: "DELETE"
	});

	getTasks();
}

function taskItemHtml() {
  return `
	<div class="task-list__item">
		<div class="task-list__item-content">
			<div class="task-list__item-title">Задача 1</div>
			<small class="task-list__item-creationTS">11.02.2003</small>
		</div>
		<div class="task-list__item-tools">
			<button class="btn task-list__item-edit">Изменить</button>
			<button class="btn task-list__item-delete">Удалить</button>
			<input class="task-list__item-status" type="checkbox">
		</div>
	</div>`;
}

function htmlToNode(html) {
	const node = document.createElement("template");
	node.innerHTML = html;

	return node.content.childNodes[1];
}

document.querySelector(".add-task").addEventListener("click", openCreateTaskModal);

function openEditTaskModal(task) {
	openTaskModal("Изменение задачи", "Сохранить", editTask, task);
}

function openCreateTaskModal() {
	openTaskModal("Новая задача", "Создать", createTask);
}

function openTaskModal(title, btnText, formCb, task = null) {
	const modal = document.querySelector(".task-modal");
  
	modal.classList.remove("hidden");
	modal.querySelector(".form").onsubmit = null;
	modal.querySelector(".form").onsubmit = (e) => formCb(e, task);
	modal.querySelector(".modal__content-title").textContent = title;
	modal.querySelector(".btn").textContent = btnText;
  }

async function createTask(e) {
	e.preventDefault();
	const formEl = document.querySelector(".task-modal .form");
	const formData = new FormData(formEl);
	const formObj = Object.fromEntries(formData.entries());

	await fetch(taskApi, {
		method: "POST",
		body: JSON.stringify({
			title: formObj.title,
			status: formObj.status ? TASK_COMPLETE : TASK_PENDING
		})
	});

	await getTasks();
}

async function editTask(e, task) {
	e.preventDefault();

	const formEl = document.querySelector(".task-modal .form");
	const formData = new FormData(formEl);
	const formObj = Object.fromEntries(formData.entries());

	await fetch(`${taskApi}/${task.id}`, {
		method: "PUT",
		body: JSON.stringify({
			title: formObj.title,
			status: formObj.status ? TASK_COMPLETE : TASK_PENDING
		})
	});

	await getTasks();
}