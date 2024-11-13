import { authApi, fetchJson } from "../shared/api.js";

export default class AuthController {
	constructor(appController) {
		this.appController = appController;
		this.isAuth = false;
	}

	async check() {
		const response = await fetchJson({
			path: `${authApi}/check`,
			method: "GET",
		});

		if (response.ok) {
			const isAuth = await response.json();
			this.isAuth = isAuth.result;
		}
	}

	async login() {
		const data = this.getFormData();
		const response = await fetch(`${authApi}/login`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		});
		if (response.ok) this.isAuth = true;
		else {
			const error = await response.json();
			throw new Error(error.error);
		}

		this.appController.update();
	}

	async registration() {
		const data = this.getFormData();
		const response = await fetch(`${authApi}/registration`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		});
		if (response.ok) this.isAuth = true;
		else {
			const error = await response.json();
			throw new Error(error.error);
		}

		this.appController.update();
	}

	async logout() {
		await fetchJson({ path: `${authApi}/logout`, method: "POST" });
		this.isAuth = false;
		this.appController.update();
	}

	getFormData() {
		const formEl = document.querySelector(".auth-modal .form");
		const formData = new FormData(formEl);
		return Object.fromEntries(formData.entries());
	}
}
