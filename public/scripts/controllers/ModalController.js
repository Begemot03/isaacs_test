export default class ModalController {
	constructor({ selector, openBtnSelector, title, submit, submitText }) {
		this.title = title;
		this.submit = submit;
		this.submitText = submitText;
		this.modal = document.querySelector(selector);
		this.submitBtn = this.modal.querySelector(".btn");
		this.modalTitle = this.modal.querySelector(".modal__content-title");
		this.modalOpenBtn = document.querySelector(openBtnSelector);
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

		this.modal.querySelector(".form").onsubmit = (e) => {
			e.preventDefault();
			this.submit(e).then(() => {
				this.closeModal();
			});
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
		this.modal.classList.add("hidden");
	}
}
