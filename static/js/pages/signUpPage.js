import { PageImage } from "../components/signComponents/page__image/page__image.js";
import { Sign_Location } from "../components/signComponents/sign-location/sign-location.js";
import { Sign_LocationHeader } from "../components/signComponents/sign-location__header/sign-location__header.js";
import { Sign_LocationHeader_Title } from "../components/signComponents/sign-location__header-title/sign-location__header-title.js";
import { Sign_Form } from "../components/signComponents/sign-form/sign-form.js";
import { Sign_FormContainer } from "../components/signComponents/sign-form__container/sign-form__container.js";
import { Href_Sign } from "../components/signComponents/href-sign/href-sign.js";
import { Button_Sign } from "../components/signComponents/button-sign/button-sign.js";

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

        const location = new Sign_Location(
            this.#root,
            this.signupConfig.location
        );
        location.render();

        const sign = document.querySelector(".sign-location");

        const mainLogo = new Sign_LocationHeader(
            sign,
            this.signupConfig.mainLogo
        );
        mainLogo.render();

        const formTitle = new Sign_LocationHeader_Title(
            sign,
            this.signupConfig.formTitle
        );
        formTitle.render();

        const form = new Sign_Form(sign);
        form.render();

        const formSelector = document.querySelector(".sign-form");

        const inputText = new Sign_FormContainer(
            formSelector,
            this.signupConfig.inputs
        );
        inputText.render();

        const signHref = new Href_Sign(
            formSelector,
            this.signupConfig.signHref
        );
        signHref.render();

        const signButton = new Button_Sign(
            formSelector,
            this.signupConfig.signButton
        );
        signButton.render();
    }

    redirectTo(newPage) {
        newPage.renderPage();
    }
}
