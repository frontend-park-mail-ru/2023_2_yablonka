import { PageImage } from "/components/signComponents/page__image/page__image.js";
import { SignLocation } from "/components/signComponents/sign-location/sign-location.js";
import { SignLocationHeader } from "/components/signComponents/sign-location__header/sign-location__header.js";
import { SignLocationHeaderTitle } from "/components/signComponents/sign-location__header-title/sign-location__header-title.js";
import { SignForm } from "/components/signComponents/sign-form/sign-form.js";
import { SignFormContainer } from "/components/signComponents/sign-form__container/sign-form__container.js";
import { HrefForgottenPassword } from "/components/signComponents/href-forgotten-password/href-forgotten-password.js";
import { HrefSign } from "/components/signComponents/href-sign/href-sign.js";
import { ButtonSign } from "/components/signComponents/button-sign/button-sign.js";
import { ErrorMessage } from "/components/signComponents/error-message/error-message.js";
import { AJAX } from "/components/core/ajax/ajax.js";

/**
 * Класс для рендера страницы логина
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */

export class SignIn {
    #root;

    constructor(rootElement) {
        this.#root = rootElement;
    }

    signinConfig = {
        images: {
            left: {
                side: "left",
                picture: "undraw_meet_the_team",
            },
            right: {
                side: "right",
                picture: "undraw_creative_woman",
            },
        },
        signFormContainer: {
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
        },
        signLocationHeader: {
            signLocationHeader: {
                logo: "logo",
                title: "Tabula",
            },
        },
        signLocationHeaderTitle: {
            signLocationHeaderTitle: {
                title: "Вход",
            },
        },

        hrefForgottenPassword: {
            hrefForgottenPassword: {
                text: "Забыли пароль?",
            },
        },

        signHref: {
            signHref: {
                url: "signup",
                text: "Регистрация",
            },
        },

        buttonSign: {
            buttonSign: {
                text: "Войти",
                id: "signin",
            },
        },
    };

    /**
     * Рендер страницы в DOM
     */
    renderPage() {
        this.#root.innerHTML = "";
        this.#root.style.backgroundColor = "#37426d";
        document.title = "Tabula: Sign In";

        history.pushState(null, null, "signin");

        const pageImage = new PageImage(this.#root, this.signinConfig.images);
        pageImage.render();

        const signLocation = new SignLocation(this.#root);
        signLocation.render();

        const signLocationElement = document.querySelector(".sign-location");

        const signLocationHeader = new SignLocationHeader(
            signLocationElement,
            this.signinConfig.signLocationHeader
        );
        signLocationHeader.render();

        const signLocationHeaderTitle = new SignLocationHeaderTitle(
            signLocationElement,
            this.signinConfig.signLocationHeaderTitle
        );
        signLocationHeaderTitle.render();

        const signForm = new SignForm(signLocationElement);
        signForm.render();

        const signFormElement = document.querySelector(".sign-form");

        const signFormContainer = new SignFormContainer(
            signFormElement,
            this.signinConfig.signFormContainer
        );
        signFormContainer.render();

        const signFormInputs = document.querySelectorAll(
            ".sign-form__container"
        );
        signFormInputs.forEach((input) => {
            const errorMessage = new ErrorMessage(input);
            errorMessage.render();
        });

        const hrefForgottenPassword = new HrefForgottenPassword(
            signFormElement,
            this.signinConfig.hrefForgottenPassword
        );
        hrefForgottenPassword.render();

        const hrefSign = new HrefSign(
            signFormElement,
            this.signinConfig.signHref
        );
        hrefSign.render();

        document.querySelector(".href-sign").addEventListener("click", (e) => {
            e.preventDefault();
            const hrefSign = new HrefSign(this.#root);
            hrefSign.render();
        });

        const buttonSign = new ButtonSign(
            signFormElement,
            this.signinConfig.buttonSign
        );
        buttonSign.render();
    }

    /**
     * Аутентифицирует данные
     * @returns {Promise} - Результат запроса
     */

    async authentificate() {
        const emailInput = document.querySelector('input[input-type="email"]');
        const passwInput = document.querySelector(
            'input[input-type="password"]'
        );

        const result = await AJAX(
            "http://213.219.215.40:8080/api/v1/auth/login/",
            "POST",
            { email: emailInput.value, password: passwInput.value }
        );

        return result;
    }
}
