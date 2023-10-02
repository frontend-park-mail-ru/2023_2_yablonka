import { PageImage } from "../components/signComponents/page__image/page__image.js";
import { SignLocation } from "../components/signComponents/sign-location/sign-location.js";
import { SignLocationHeader } from "../components/signComponents/sign-location__header/sign-location__header.js";
import { SignLocationHeaderTitle } from "../components/signComponents/sign-location__header-title/sign-location__header-title.js";
import { SignForm } from "../components/signComponents/sign-form/sign-form.js";
import { SignFormContainer } from "../components/signComponents/sign-form__container/sign-form__container.js";
import { HrefForgottenPassword } from "../components/signComponents/href-forgotten-password/href-forgotten-password.js";
import { HrefSign } from "../components/signComponents/href-sign/href-sign.js";
import { ButtonSign } from "../components/signComponents/button-sign/button-sign.js";

import { SignUp } from "./signUpPage.js";

export class SignIn {
    #root;

    constructor(rootElement) {
        this.#root = rootElement;
    }

    signinConfig = {
        images: {
            left: {
                side: "left",
                picture: "../svg/undraw_meet_the_team",
            },
            right: {
                side: "right",
                picture: "../svg/undraw_creative_woman",
            },
        },
        inputs: {
            email: {
                icon: "../svg/person",
                type: "text",
                placeholder: "Email",
            },
            password: {
                icon: "../svg/lock",
                type: "password",
                placeholder: "Пароль",
            },
        },
        mainLogo: {
            mainLogo: {
                logo: "../svg/logo",
                title: "Tabula",
            },
        },
        formTitle: {
            formTitle: {
                title: "Вход",
            },
        },

        forgottenPassword: {
            forgottenPassword: {
                text: "Забыли пароль?",
            },
        },

        signHref: {
            signHref: {
                url: "signup",
                text: "Регистрация",
            },
        },

        signButton: {
            signButton: {
                text: "Войти",
            },
        },

        location: {
            location: {},
        },
    };

    renderPage() {
        this.#root.innerHTML = "";
        this.#root.style.backgroundColor = "#37426d";
        document.title = "Tabula: Sign In";

        const pageImage = new PageImage(this.#root, this.signinConfig.images);
        pageImage.render();

        const signLocation = new SignLocation(
            this.#root,
            this.signinConfig.location
        );
        signLocation.render();

        const signLocationElement = document.querySelector(".sign-location");

        const signLocationHeader = new SignLocationHeader(
            signLocationElement,
            this.signinConfig.mainLogo
        );
        signLocationHeader.render();

        const signLocationHeaderTitle = new SignLocationHeaderTitle(
            signLocationElement,
            this.signinConfig.formTitle
        );
        signLocationHeaderTitle.render();

        const signForm = new SignForm(signLocationElement);
        signForm.render();

        const signFormElement = document.querySelector(".sign-form");

        const signFormContainer = new SignFormContainer(signFormElement, this.signinConfig.inputs);
        signFormContainer.render();

        const hrefForgottenPassword = new HrefForgottenPassword(
            signFormElement,
            this.signinConfig.forgottenPassword
        );
        hrefForgottenPassword.render();

        const hrefSign = new HrefSign(
            signFormElement,
            this.signinConfig.signHref
        );
        hrefSign.render();

        document.querySelector(".href-sign").addEventListener("click", (e) => {
            e.preventDefault();
            const href_sign = new HrefSign(this.#root);
            href_sign.render();
        });

        const buttonSign = new ButtonSign(
            signFormElement,
            this.signinConfig.signButton
        );
        buttonSign.render();
    }

    redirectTo(route) {}
}