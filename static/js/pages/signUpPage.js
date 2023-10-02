import { PageImage } from "../components/signComponents/page__image/page__image.js";
import { SignLocation } from "../components/signComponents/sign-location/sign-location.js";
import { SignLocationHeader } from "../components/signComponents/sign-location__header/sign-location__header.js";
import { SignLocationHeaderTitle } from "../components/signComponents/sign-location__header-title/sign-location__header-title.js";
import { SignForm } from "../components/signComponents/sign-form/sign-form.js";
import { SignFormContainer } from "../components/signComponents/sign-form__container/sign-form__container.js";
import { HrefSign } from "../components/signComponents/href-sign/href-sign.js";
import { ButtonSign } from "../components/signComponents/button-sign/button-sign.js";

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
        document.title = "Tabula: Sign Up";

        const images = new PageImage(this.#root, this.signupConfig.images);
        images.render();

        const location = new SignLocation(
            this.#root,
            this.signupConfig.location
        );
        location.render();

        const sign = document.querySelector(".sign-location");

        const mainLogo = new SignLocationHeader(
            sign,
            this.signupConfig.mainLogo
        );
        mainLogo.render();

        const formTitle = new SignLocationHeaderTitle(
            sign,
            this.signupConfig.formTitle
        );
        formTitle.render();

        const form = new SignForm(sign);
        form.render();

        const formSelector = document.querySelector(".sign-form");

        const inputText = new SignFormContainer(
            formSelector,
            this.signupConfig.inputs
        );
        inputText.render();

        const signHref = new HrefSign(
            formSelector,
            this.signupConfig.signHref
        );
        signHref.render();

        const signButton = new ButtonSign(
            formSelector,
            this.signupConfig.signButton
        );
        signButton.render();
    }

    redirectTo(newPage) {
        newPage.renderPage();
    }
}
