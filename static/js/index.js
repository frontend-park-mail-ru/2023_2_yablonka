"use strict";

import { SignIn } from "/pages/signInPage.js";
import { SignUp } from "/pages/signUpPage.js";
import { YourDesks } from "/pages/yourDesksPage.js";
import { AJAX } from "/components/core/ajax/ajax.js";

const root = document.querySelector(".page");
const pathname = window.location.pathname;

const yd = new YourDesks(root);
const signUpPage = new SignUp(root);
const signInPage = new SignIn(root);

const logged = await AJAX("http://localhost:8080/api/v1/auth/verify/", "GET")
    .then((res) => res.json())
    .catch((err) => null);

console.log(logged);
let currentPage;

if (logged && !("error_response" in logged.body)) {
    currentPage = yd;
    console.log(logged);
    currentPage.renderPage(logged.body.user);
} else {
    if (pathname == "/signin") {
        currentPage = signInPage;
        signInPage.renderPage();
    } else if (pathname == "/signup") {
        currentPage = signUpPage;
        signUpPage.renderPage();
    } else {
        currentPage = signInPage;
        signInPage.renderPage();
    }
}

document.querySelector("body").addEventListener("click", async (e) => {
    e.preventDefault();
    if (e.target.tagName == "A") {
        const ref = e.target;
        const link = ref.getAttribute("href");

        if (link == "signup.html") {
            currentPage = signUpPage;
            signUpPage.renderPage();
        } else if (link == "signin.html") {
            currentPage = signInPage;
            signInPage.renderPage();
        }
    }

    if (
        e.target.tagName == "INPUT" &&
        e.target.getAttribute("type") == "submit"
    ) {
        const button = document.querySelector(".button-sign");

        if (button.getAttribute("id") == "signin") {
            const data = document.querySelectorAll(".sign-form__input");
            if (!validateEmail(data[0].value)) {
                errorMessage("email", "Неверно введён email");
                return;
            } else if (!validatePassword(data[1].value)) {
                errorMessage("password", "Неверно введён пароль");
                return;
            }
            const resp = await currentPage
                .authentificate()
                .then((res) => res.json())
                .catch((err) => null);

            if (!resp) {
                errorMessage("email", "Что-то пошло не так");
                return;
            } else if ("error_response" in resp.body) {
                errorMessage("email", "Неверный логин или пароль");
                return;
            }
            currentPage = yd;
            yd.renderPage(resp.body.user);
        } else if (button.getAttribute("id") == "signup") {
            const data = document.querySelectorAll(".sign-form__input");
            if (!validateEmail(data[0].value)) {
                errorMessage("email", "Неверно введён email");
                return;
            } else if (!validatePassword(data[1].value)) {
                errorMessage("password", "Неверно введён пароль");
                return;
            } else if (!validateRepeatPasswords(data[1].value, data[2].value)) {
                errorMessage("repeatPassword", "Пароли не совпадают");
                return;
            } else {
                const resp = await currentPage
                    .authentificate()
                    .then((res) => res.json())
                    .catch((err) => null);

                console.log(resp);

                if (!resp) {
                    errorMessage("email", "Что-то пошло не так");
                } else if ("error_response" in resp.body) {
                    errorMessage("email", "Пользователь уже существует");
                }
                currentPage = yd;
                yd.renderPage(resp.body.user);
            }
        }
    } else if (e.target.tagName == "IMG" && e.target.className == "log-out") {
        const logout = await AJAX(
            "http://localhost:8080/api/v1/auth/logout/",
            "POST",
            {}
        )
            .then((res) => res)
            .catch((err) => null);
        currentPage = signInPage;
        currentPage.renderPage();
    }
});

window.addEventListener("popstate", (e) => {
    if (pathname == "/signin") {
        signInPage.renderPage();
    } else if (pathname == "/signup") {
        signUpPage.renderPage();
    } else if (pathname == "/") {
        signUpPage.renderPage();
    }
});

const errorMessage = (inputType, message) => {
    const input = document.querySelector(`input[input-type="${inputType}"]`);
    let err = input.parentElement.childNodes[0];
    err.textContent = message;
    setTimeout(() => {
        err.style.opacity = "0";
        err.style.opacity = "1";
    }, 1);

    setTimeout(() => {
        err.style.opacity = "0";
        err.style.opacity = "1";
    }, 500);

    setTimeout(() => {
        err.style.opacity = "1";
        err.style.opacity = "0";
        err.textContent = "";
    }, 5000);
};

const validateEmail = (email) => {
    let re = new RegExp(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/);
    return re.test(email);
};

const validateRepeatPasswords = (password1, password2) => {
    return password1 === password2;
};

const validatePassword = (password) => {
    let re = new RegExp(/^\w{8,}$/);
    return re.test(password);
};
