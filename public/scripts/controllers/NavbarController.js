export default class NavbarController {
	constructor(authController) {
		this.authController = authController;
		this.addTask = document.querySelector(".add-task");
		this.nav = document.querySelector(".nav");
	}

	update() {
		this.clearNavbar();
		if (this.authController.isAuth) {
			this.authNavbar();
		} else {
			this.noAuthNavbar();
		}
	}

	noAuthNavbar() {
		const registrationBtn = this.createNavItem("Зарегистрироваться", ["registration"]);
		const loginBtn = this.createNavItem("Войти", ["login"]);

		this.addTask.classList.add("hidden");

		this.nav.appendChild(registrationBtn);
		this.nav.appendChild(loginBtn);
	}

	authNavbar() {
		const logoutBtn = this.createNavItem("Выйти", ["logout"]);

		this.addTask.classList.remove("hidden");

		logoutBtn.addEventListener("click", async () => {
			await this.authController.logout();
			this.update();
		});

		this.nav.appendChild(logoutBtn);
	}

	clearNavbar() {
		this.nav.innerHTML = "";
	}

	createNavItem(text, classes = []) {
		const navItem = document.createElement("span");
		navItem.textContent = text;
		navItem.classList.add("nav__item", ...classes);
		return navItem;
	}
}