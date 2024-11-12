const api = "http://localhost:8000/api";
const authApi = `${api}/auth`;
const taskApi = `${api}/task`;

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
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    window.isAuth = result.result;
}

function configureNavbar() {
    if(window.isAuth) navbarOnAuth();
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
    document.querySelectorAll(".modal").forEach(modal => {
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
    modal.querySelector('.form').addEventListener("submit", formCb);
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
            "Content-Type": "application/json"
        }
    });

    if(response.ok) {
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
            "Content-Type": "application/json"
        }
    });

    if(response.ok) {
        auth();
    }
}

async function logout() {
    window.isAuth = false;
    navbarOnNoAuth();

    await fetch(`${authApi}/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function getTasks() {
    const response = await fetch(`${taskApi}/task`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const r = await response.json();
    
    console.log(r);
}