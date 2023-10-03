"use strict";

import { SignIn } from "./pages/signInPage.js";
import { SignUp } from "./pages/signUpPage.js";
import { YourDesks } from "./pages/yourDesksPage.js";
import { AJAX } from "./components/core/ajax/ajax.js";

const root = document.querySelector(".page");
const pathname = window.location.pathname;

const yd = new YourDesks(root);
const signUpPage = new SignUp(root);
const signInPage = new SignIn(root);

const logged = AJAX("http://localhost:8080/api/v1/auth/verify", "GET", {})
    .then((res) => JSON.parse(res))
    .catch((err) => null);

let currentPage;

if (logged.statusCode == 200) {
    currentPage = yd;
    currentPage.renderPage();
}

if (pathname == "/signin") {
    currentPage = signInPage;
    signInPage.renderPage();
} else if (pathname == "/signup") {
    currentPage = signUpPage;
    signUpPage.renderPage();
} else if (pathname == "/") {
    currentPage = signUpPage;
    signUpPage.renderPage();
}

document.querySelector("body").addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.tagName == "A") {
        const ref = e.target;
        const link = ref.getAttribute("href");

        if (link == "signup.html") {
            signUpPage.renderPage();
        } else if (link == "signin.html") {
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
            } else if (!validatePassword(data[1].value)) {
                errorMessage("password", "Неверно введён пароль");
            }
            const resp = currentPage.authentificate();
            //Условия при разных статус кодах
        } else if (button.getAttribute("id") == "signup") {
            const data = document.querySelectorAll(".sign-form__input");
            if (!validateEmail(data[0].value)) {
                errorMessage("email", "Неверно введён email");
            } else if (!validatePassword(data[1].value)) {
                errorMessage("password", "Неверно введён пароль");
            } else if (!validateRepeatPasswords(data[1].value, data[2].value)) {
                errorMessage("repeatPassword", "Пароли не совпадают");
            }
            const resp = currentPage.authentificate();

            //ТУт надо условия при разных статус кодах
        }
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
    let re = new RegExp(
        /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@([a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?.)*/
    );
    return re.test(email);
};

const validateRepeatPasswords = (password1, password2) => {
    return password1 === password2;
};

const validatePassword = (password) => {
    let re = new RegExp(/^\w{8,}$/);
    return re.test(password);
};
