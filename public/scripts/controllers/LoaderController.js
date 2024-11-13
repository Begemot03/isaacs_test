class LoaderController {
    constructor() {
        this.loader = document.querySelector(".loading-modal");
        this.hide();
    }

    show() {
        this.loader.classList.remove("hidden");
    }

    hide() {
        this.loader.classList.add("hidden");
    }
}

const loaderController = new LoaderController();

export default loaderController;