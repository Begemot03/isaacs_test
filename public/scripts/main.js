import AppController from "./controllers/AppController.js";



window.onload = main;

async function main() {
	const appController = new AppController();

	appController.update();
}


