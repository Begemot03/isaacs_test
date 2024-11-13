import ModalController from "./ModalController.js";
import AuthController from "./AuthController.js";
import TaskController from "./TaskController.js";
import NavbarController from "./NavbarController.js";

export default class AppController {
	constructor() {
		this.authController = new AuthController(this);
		this.taskController = new TaskController();
		this.navbarController = new NavbarController(this.authController);
	}

	async update() {
		await this.authController.check();
		this.navbarController.update();

		if (this.authController.isAuth) {
			await this.taskController.getTasks();            
		} else {
			this.taskController.createNoAuthTaskList();
            this.noAuthModals();
		}
	}

    noAuthModals () {
        this.loginModal = new ModalController({
            selector: ".auth-modal",
            openBtnSelector: ".login",
            title: "Вход",
            submitText: "Войти",
            submit: (e) => this.handleFormSubmit(e)
        });

        this.registrationModal = new ModalController({
            selector: ".auth-modal",
            openBtnSelector: ".registration",
            title: "Регистрация",
            submitText: "Зарегистрироваться",
            submit: (e) => this.handleFormSubmit(e)
        });
    }

	async handleFormSubmit(e) {
		e.preventDefault();

		if (this.loginModal.isOpen) {
			await this.authController.login(e);
		} else {
			await this.authController.registration(e);
		}
        
		this.update();
	}
}