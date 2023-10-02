import { PageImage } from "../components/signComponents/page__image/page__image.js";
import { Sign_Location } from "../components/signComponents/sign-location/sign-location.js";
import { Sign_LocationHeader } from "../components/signComponents/sign-location__header/sign-location__header.js";
import { Sign_LocationHeader_Title } from "../components/signComponents/sign-location__header-title/sign-location__header-title.js";
import { Sign_Form } from "../components/signComponents/sign-form/sign-form.js";
import { Sign_FormContainer } from "../components/signComponents/sign-form__container/sign-form__container.js";
import { Href_Forgotten_Password } from "../components/signComponents/href-forgotten-password/href-forgotten-password.js";
import { Href_Sign } from "../components/signComponents/href-sign/href-sign.js";
import { Button_Sign } from "../components/signComponents/button-sign/button-sign.js";

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

        const sign_Location = new Sign_Location(
            this.#root,
            this.signinConfig.location
        );
        sign_Location.render();

        const sign_LocationElement = document.querySelector(".sign-location");

        const sign_LocationHeader = new Sign_LocationHeader(
            sign_LocationElement,
            this.signinConfig.mainLogo
        );
        sign_LocationHeader.render();

        const sign_LocationHeader_Title = new Sign_LocationHeader_Title(
            sign_LocationElement,
            this.signinConfig.formTitle
        );
        sign_LocationHeader_Title.render();

        const sign_Form = new Sign_Form(sign_LocationElement);
        sign_Form.render();

        const sign_FormElement = document.querySelector(".sign-form");

        const sign_FormContainer = new Sign_FormContainer(sign_FormElement, this.signinConfig.inputs);
        sign_FormContainer.render();

        const href_Forgotten_Password = new Href_Forgotten_Password(
            sign_FormElement,
            this.signinConfig.forgottenPassword
        );
        href_Forgotten_Password.render();

        const href_Sign = new Href_Sign(
            sign_FormElement,
            this.signinConfig.signHref
        );
        href_Sign.render();

        document.querySelector(".href-sign").addEventListener("click", (e) => {
            e.preventDefault();
            const href_sign = new Href_Sign(this.#root);
            href_sign.render();
        });

        const button_Sign = new Button_Sign(
            sign_FormElement,
            this.signinConfig.signButton
        );
        button_Sign.render();
    }

    redirectTo(route) {}
}
