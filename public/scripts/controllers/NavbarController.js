export default class NavbarController {
	constructor(authController) {
		this.authController = authController;
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

		this.nav.appendChild(registrationBtn);
		this.nav.appendChild(loginBtn);
	}

	authNavbar() {
		const logoutBtn = this.createNavItem("Выйти", ["logout"]);

		logoutBtn.addEventListener("click", async () => {
			await this.authController.logout();
			this.update(); // Обновление навбара после выхода
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