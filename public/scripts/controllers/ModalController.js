export default class ModalController {
	constructor({ selector, openBtnSelector, title, submit, submitError, submitText }) {
		this.title = title;
		this.submit = submit;
		this.submitText = submitText;
		this.modal = document.querySelector(selector);
		this.submitBtn = this.modal.querySelector(".btn");
		this.modalTitle = this.modal.querySelector(".modal__content-title");
		this.modalOpenBtn = document.querySelector(openBtnSelector);
		this.formError = this.modal.querySelector(".form__error");
		this.form = this.modal.querySelector(".form");
		this.isOpen = false;

		this.modalOpenBtn.addEventListener("click", () => {
			this.openModal();
		});

		this.modal.addEventListener("click", () => {
			this.closeModal();
		});

		this.modal
			.querySelector(".modal__content")
			.addEventListener("click", (e) => e.stopPropagation());

		this.form.onsubmit = async (e) => {
			e.preventDefault();
			
			try {
				await this.submit(e);
				this.form.classList.remove("error");
				this.closeModal();
			} catch(error) {
				this.formError.textContent = error.message;
				this.form.classList.add("error");
			}
		};
	}

	openModal() {
		this.modalTitle.textContent = this.title;
		this.submitBtn.textContent = this.submitText;
		this.isOpen = true;
		this.modal.classList.remove("hidden");
	}

	closeModal() {
		this.isOpen = false;
		this.form.classList.remove("error");
		this.modal.classList.add("hidden");
	}
}
