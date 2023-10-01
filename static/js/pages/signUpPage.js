import { Image } from "../components/signComponents/backgroundImage/backgroundImage.js";
import { Location } from "../components/signComponents/signLocation/signLocation.js";
import { MainLogo } from "../components/signComponents/mainLogo/mainLogo.js";
import { FormTitle } from "../components/signComponents/formTitle/formTitle.js";
import { FormComponent } from "../components/signComponents/formComponent/formComponent.js";
import { Input } from "../components/signComponents/formInput/formInput.js";
import { ForgottenPassword } from "../components/signComponents/forgottenPassword/forgottenPassword.js";
import { SignHref } from "../components/signComponents/signHref/signHref.js";
import { SignButton } from "../components/signComponents/signButton/signButton.js";

export class SignUp {
    #root;

    constructor(rootElement) {
        this.#root = rootElement;
    }

    signupConfig = {
        images: {
            left: {
                side: "left",
                picture: "../svg/undraw_performance_overview",
            },
            right: {
                side: "right",
                picture: "../svg/undraw_team_collaboration",
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
            repeatPassword: {
                icon: "../svg/key",
                type: "password",
                placeholder: "Повторите пароль",
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
            },
        },
        location: {
            location: {},
        },
    };

    renderPage() {
        this.#root.innerHTML = "";
        this.#root.style.backgroundColor = "#37426d";

        const images = new Image(this.#root, this.signupConfig.images);
        images.render();

        const location = new Location(this.#root, this.signupConfig.location);
        location.render();

        const sign = document.querySelector(".sign-location");

        const mainLogo = new MainLogo(sign, this.signupConfig.mainLogo);
        mainLogo.render();

        const formTitle = new FormTitle(sign, this.signupConfig.formTitle);
        formTitle.render();

        const form = new FormComponent(sign);
        form.render();

        const formSelector = document.querySelector(".sign-form");

        const inputText = new Input(formSelector, this.signupConfig.inputs);
        inputText.render();

        const signHref = new SignHref(formSelector, this.signupConfig.signHref);
        signHref.render();

        const signButton = new SignButton(
            formSelector,
            this.signupConfig.signButton
        );
        signButton.render();
    }

    redirectTo(newPage) {
        newPage.renderPage();
    }
}
