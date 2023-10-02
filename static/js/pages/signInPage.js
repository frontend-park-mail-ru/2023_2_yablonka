import { Image } from "../components/signComponents/backgroundImage/backgroundImage.js";
import { Location } from "../components/signComponents/signLocation/signLocation.js";
import { MainLogo } from "../components/signComponents/mainLogo/mainLogo.js";
import { FormTitle } from "../components/signComponents/formTitle/formTitle.js";
import { FormComponent } from "../components/signComponents/formComponent/formComponent.js";
import { Input } from "../components/signComponents/formInput/formInput.js";
import { ForgottenPassword } from "../components/signComponents/forgottenPassword/forgottenPassword.js";
import { SignHref } from "../components/signComponents/signHref/signHref.js";
import { SignButton } from "../components/signComponents/signButton/signButton.js";

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
        const images = new Image(this.#root, this.signinConfig.images);
        images.render();
        const location = new Location(this.#root, this.signinConfig.location);
        location.render();

        const sign = document.querySelector(".sign-location");

        const mainLogo = new MainLogo(sign, this.signinConfig.mainLogo);
        mainLogo.render();

        const formTitle = new FormTitle(sign, this.signinConfig.formTitle);
        formTitle.render();

        const form = new FormComponent(sign);
        form.render();

        const formSelector = document.querySelector(".sign-form");

        const inputText = new Input(formSelector, this.signinConfig.inputs);
        inputText.render();

        const forgottenPassword = new ForgottenPassword(
            formSelector,
            this.signinConfig.forgottenPassword
        );
        forgottenPassword.render();

        const signHref = new SignHref(formSelector, this.signinConfig.signHref);
        signHref.render();

        document.querySelector(".href-sign").addEventListener("click", (e) => {
            e.preventDefault();
            const signUp = new SignUp(this.#root);
            SignUp.renderPage();
        });

        const signButton = new SignButton(
            formSelector,
            this.signinConfig.signButton
        );
        signButton.render();
    }

    redirectTo(route) {}
}
