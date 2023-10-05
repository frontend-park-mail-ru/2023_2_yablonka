import { PageImage } from "/components/signComponents/page__image/page__image.js";
import { SignLocation } from "/components/signComponents/sign-location/sign-location.js";
import { SignLocationHeader } from "/components/signComponents/sign-location__header/sign-location__header.js";
import { SignLocationHeaderTitle } from "/components/signComponents/sign-location__header-title/sign-location__header-title.js";
import { SignForm } from "/components/signComponents/sign-form/sign-form.js";
import { SignFormContainer } from "/components/signComponents/sign-form__container/sign-form__container.js";
import { HrefSign } from "/components/signComponents/href-sign/href-sign.js";
import { ButtonSign } from "/components/signComponents/button-sign/button-sign.js";
import { ErrorMessage } from "/components/signComponents/error-message/error-message.js";
import { AJAX } from "/components/core/ajax/ajax.js";
import { Validator } from "/components/core/validation/validator.js";
import { errorMessage } from "/components/core/signErrorMessage/errorMessage.js";
import { loginCheck } from "../components/core/routing/loginCheck.js";

/**
 * Класс для рендера страницы регистрации
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */

export class SignUp {
    #root;

    constructor(rootElement) {
        this.#root = rootElement;
    }

    signupConfig = {
        images: {
            left: {
                side: "left",
                picture: "undraw_performance_overview",
            },
            right: {
                side: "right",
                picture: "undraw_team_collaboration",
            },
        },
        inputs: {
            email: {
                icon: "person",
                type: "text",
                placeholder: "Email",
                inputType: "email",
            },
            password: {
                icon: "lock",
                type: "password",
                placeholder: "Пароль",
                inputType: "password",
            },
            repeatPassword: {
                icon: "key",
                type: "password",
                placeholder: "Повторите пароль",
                inputType: "repeatPassword",
            },
        },
        mainLogo: {
            mainLogo: {
                logo: "logo",
                title: "Tabula",
            },
        },

        formTitle: {
            formTitle: {
                title: "Регистрация",
            },
        },
        signHref: {
            signHref: {
                url: "signin",
                text: "Уже есть аккаунт?",
            },
        },
        signButton: {
            signButton: {
                text: "Зарегистрироваться",
                id: "signup",
            },
        },
    };

    /**
     * Рендер страницы в DOM
     */

    async renderPage() {
        this.#root.innerHTML = "";
        this.#root.style.backgroundColor = "#37426d";
        document.title = "Tabula: Sign Up";

        const logged = await loginCheck();

        if (logged && !("error_response" in logged.body)) {
            history.pushState(null, null, "desks");
            window.dispatchEvent(new PopStateEvent("popstate"));
            return;
        }

        const pageImage = new PageImage(this.#root, this.signupConfig.images);
        pageImage.render();

        const signLocation = new SignLocation(this.#root);
        signLocation.render();

        const signLocationElement = document.querySelector(".sign-location");

        const signLocationHeader = new SignLocationHeader(
            signLocationElement,
            this.signupConfig.mainLogo
        );
        signLocationHeader.render();

        const formTitle = new SignLocationHeaderTitle(
            signLocationElement,
            this.signupConfig.formTitle
        );
        formTitle.render();

        const signForm = new SignForm(signLocationElement);
        signForm.render();

        const signFormElement = document.querySelector(".sign-form");

        const signFormContainer = new SignFormContainer(
            signFormElement,
            this.signupConfig.inputs
        );
        signFormContainer.render();

        const signFormInputs = document.querySelectorAll(
            ".sign-form__container"
        );
        signFormInputs.forEach((input) => {
            const errorMessage = new ErrorMessage(input);
            errorMessage.render();
        });

        const hrefSign = new HrefSign(
            signFormElement,
            this.signupConfig.signHref
        );
        hrefSign.render();

        const buttonSign = new ButtonSign(
            signFormElement,
            this.signupConfig.signButton
        );
        buttonSign.render();
        this.#addEventListeners();
    }

    #addEventListeners() {
        document
            .querySelector(".button-sign")
            .addEventListener("click", async (e) => {
                e.preventDefault();
                const data = document.querySelectorAll(".sign-form__input");
                console.log(data[0].value);
                if (!Validator.validateEmail(data[0].value)) {
                    errorMessage("email", "Некорректный email");
                } else if (!Validator.validatePassword(data[1].value)) {
                    errorMessage(
                        "password",
                        "Некорректный пароль, он должен состоять из букв и цифр и быть длиннее 8 символов"
                    );
                } else if (
                    !Validator.validateRepeatPasswords(
                        data[1].value,
                        data[2].value
                    )
                ) {
                    errorMessage("repeatPassword", "Пароли не совпадают");
                } else {
                    const resp = await SignUp.authentificate()
                        .then((res) => res.json())
                        .catch((err) => null);
                    if (!resp || "error_response" in resp.body) {
                        errorMessage(
                            "email",
                            "Что-то пошло не так, попробуйте изменить email"
                        );
                    } else {
                        history.pushState(null, null, "desks");
                        window.dispatchEvent(new PopStateEvent("popstate"));
                    }
                }
            });
        document.querySelector(".href-sign").addEventListener("click", (e) => {
            const href = e.target.getAttribute("id");
            history.pushState(null, null, href);
            window.dispatchEvent(new PopStateEvent("popstate"));
        });
    }

    /**
     * Аутентифицирует данные
     * @returns {Promise} - Результат запроса
     */

    static async authentificate() {
        const emailInput = document.querySelector('input[input-type="email"]');
        const passwInput = document.querySelector(
            'input[input-type="password"]'
        );

        const result = await AJAX(
            "http://localhost:8080/api/v1/auth/signup/",
            "POST",
            { email: emailInput.value, password: passwInput.value }
        );

        return result;
    }
}
