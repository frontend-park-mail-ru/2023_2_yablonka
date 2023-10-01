"use strict";

import { Image } from "./components/backgroundImage/backgroundImage.js";
import { Location } from "./components/signLocation/signLocation.js";
import { MainLogo } from "./components/mainLogo/mainLogo.js";
import { FormTitle } from "./components/formTitle/formTitle.js";
import { FormComponent } from "./components/formComponent/formComponent.js";
import { Input } from "./components/formInput/formInput.js";
import { ForgottenPassword } from "./components/forgottenPassword/forgottenPassword.js";
import { SignHref } from "./components/signHref/signHref.js";
import { SignButton } from "./components/signButton/signButton.js";

const root = document.querySelector(".page");

const signinConfig = {
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
        logo: "../svg/logo",
        title: "Tabula",
    },
    formTitle: {
        title: "Вход",
    },
    forgottenPassword: {
        text: "Забыли пароль?",
    },
    signHref: {
        url: "signup",
        text: "Регистрация",
    },
    signButton: {
        text: "Войти",
    },
};

const images = new Image(root, signinConfig.images);
images.render();
const location = new Location(root);
location.render();

const sign = document.querySelector(".sign-location");

const mainLogo = new MainLogo(sign, signinConfig.mainLogo);
mainLogo.render();

const formTitle = new FormTitle(sign, signinConfig.formTitle);
formTitle.render();

const form = new FormComponent(sign);
form.render();

const formSelector = document.querySelector(".sign-form");

const inputText = new Input(formSelector, signinConfig.inputs);
inputText.render();

const forgottenPassword = new ForgottenPassword(formSelector, signinConfig.forgottenPassword);
forgottenPassword.render();

const signHref = new SignHref(formSelector, signinConfig.signHref);
signHref.render();

const signButton = new SignButton(formSelector, signinConfig.signButton);
signButton.render();
