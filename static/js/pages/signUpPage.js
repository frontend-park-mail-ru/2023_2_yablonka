import { PageImage } from "../components/signComponents/page__image/page__image.js";
import { SignLocation } from "../components/signComponents/sign-location/sign-location.js";
import { SignLocationHeader } from "../components/signComponents/sign-location__header/sign-location__header.js";
import { SignLocationHeaderTitle } from "../components/signComponents/sign-location__header-title/sign-location__header-title.js";
import { SignForm } from "../components/signComponents/sign-form/sign-form.js";
import { SignFormContainer } from "../components/signComponents/sign-form__container/sign-form__container.js";
import { HrefSign } from "../components/signComponents/href-sign/href-sign.js";
import { ButtonSign } from "../components/signComponents/button-sign/button-sign.js";
import { ErrorMessage } from "../components/signComponents/error-message/error-message.js";

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
        location: {
            location: {},
        },
    };

    renderPage() {
        this.#root.innerHTML = "";
        this.#root.style.backgroundColor = "#37426d";
        document.title = "Tabula: Sign Up";

        history.pushState(null, null, "signup");

        const pageImage = new PageImage(this.#root, this.signupConfig.images);
        pageImage.render();

        const signLocation = new SignLocation(
            this.#root,
            this.signupConfig.location
        );
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

        const signFormInputs = document.querySelectorAll(".sign-form__container");
        signFormInputs.forEach((input) => {
            const errorMessage = new ErrorMessage(input);
            errorMessage.render()
        });

        const hrefSign = new HrefSign(signFormElement, this.signupConfig.signHref);
        hrefSign.render();

        const buttonSign = new ButtonSign(
            signFormElement,
            this.signupConfig.signButton
        );
        buttonSign.render();
    }

    redirectTo(newPage) {
        newPage.renderPage();
    }

    authentificate() {
        const emailInput = document.querySelector('input[input-type="email"]');
        const passwInput = document.querySelector(
            'input[input-type="password"]'
        );

        const result = AJAX(
            "http://localhost:8080/api/v1/auth/signup/",
            "POST",
            { email: emailInput.value, password: passwInput.value }
        ).then(res=>JSON.parse(res)).catch(err=>null);
        return result;
    }
}
