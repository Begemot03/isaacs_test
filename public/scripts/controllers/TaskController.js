import { taskApi, fetchJson } from "../shared/api.js";
import loaderController from "./LoaderController.js";
import ModalController from "./ModalController.js";

const TASK_COMPLETE = "complete";
const TASK_PENDING = "pending";

export default class TaskController {
    constructor() {
        this.taskModal = new ModalController({
            selector: ".task-modal",
            openBtnSelector: ".add-task__btn",
            title: "Добавить задачу",
            submit: (e) => this.handleCreateTask(e),
            submitText: "Добавить",
        });
    }

    async getTasks() {
        const response = await fetchJson({ path: taskApi, method: "GET" });
        const tasks = await response.json();
        this.createTaskList(tasks);
    }

    async checkTask(e, task) {
        const status = e.target.checked ? TASK_COMPLETE : TASK_PENDING;

        await this.updateTask({ ...task, status });
    }

    async deleteTask(task) {
        await fetchJson({ path: `${taskApi}/${task.id}`, method: "DELETE" });
        await this.getTasks();
    }

    async createTask(task) {
        await fetchJson({ path: `${taskApi}`, method: "POST", body: task });
        await this.getTasks();
    }

    async updateTask(task) {
        await fetchJson({ path: `${taskApi}/${task.id}`, method: "PUT", body: task });
        await this.getTasks();
    }

    async handleCreateTask(e) {
        loaderController.show()

        const data = this.getFormData();
        await this.createTask(data);

        loaderController.hide()
    }

    async editTaskHandler(e, task) {
        loaderController.show()

        const data = this.getFormData();
        await this.updateTask({ ...data, id: task.id });

        loaderController.hide()
    }

    createEmptyTaskList() {
        const taskList = document.querySelector(".task-list");

        taskList.innerHTML = `
			<div class="task-list__item-empty">
				Задач пока нет
			</div>`;
    }

    createNoAuthTaskList() {
        const taskList = document.querySelector(".task-list");

        taskList.innerHTML = `
			<div class="task-list__item-empty">
				Войдите или зарегистрируйтесь, чтобы создавать задачи
			</div>`;
    }

    createTaskList(tasks) {
        const taskList = document.querySelector(".task-list");
        taskList.innerHTML = "";

        tasks.forEach((task) => {
            const taskHtml = this.getTaskHtml(task);
            const taskNode = htmlToNode(taskHtml);

            taskNode.querySelector(".task-list__item-delete").addEventListener("click", async () => {
                loaderController.show()
                await this.deleteTask(task);
                loaderController.hide()
            });

            taskNode.querySelector(".task-list__item-edit").addEventListener("click", () => {
                const modal = new ModalController({
                    selector: ".task-modal",
                    openBtnSelector: ".task-list__item-edit",
                    title: "Изменить",
                    submit: (e) => this.editTaskHandler(e, task),
                    submitText: "Сохранить",
                });

                modal.modal.querySelector(".form__input[type=text]").value = task.title;
                modal.modal.querySelector(".form__input[type=checkbox]").checked = task.status == TASK_COMPLETE;
                modal.openModal();
            });

            taskNode.querySelector(".task-list__item-status").addEventListener("change", (e) => {
                this.checkTask(e, task);
            });

            taskList.appendChild(taskNode);
        });
    }

    getTaskHtml(task) {
        return `<div class="task-list__item">
                    <div class="task-list__content">
                        <div class="task-list__item-title">${task.title}</div>
                        <small class="task-list__item-creationTS">${task.creationTS}</small>
                    </div>
                    <div class="task-list__tools">
                        <button class="btn task-list__item-edit">Изменить</button>
                        <button class="btn task-list__item-delete">Удалить</button>
                        <input type="checkbox" class="task-list__item-status" ${task.status === TASK_COMPLETE ? "checked" : ""}>
                    </div>
                </div>`
    }

    getFormData() {
		const formEl = document.querySelector(".task-modal .form");
		const formData = new FormData(formEl);
        const status = formEl.querySelector(".form__input[type=checkbox]").checked ? TASK_COMPLETE : TASK_PENDING;

		return { ...Object.fromEntries(formData.entries()), status };
	}
}

function htmlToNode(html) {
    const node = document.createElement("template");

    node.innerHTML = html;

    return node.content.firstChild;
}
