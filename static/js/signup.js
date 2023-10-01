"use strict";

import { Image } from "./components/backgroundImage/backgroundImage.js";
import { Location } from "./components/signLocation/signLocation.js";
import { MainLogo } from "./components/mainLogo/mainLogo.js";
import { FormTitle } from "./components/formTitle/formTitle.js";
import { FormComponent } from "./components/formComponent/formComponent.js";
import { Input } from "./components/formInput/formInput.js";
import { SignHref } from "./components/signHref/signHref.js";
import { SignButton } from "./components/signButton/signButton.js";

const root = document.querySelector(".page");

const signupConfig = {
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
        logo: "../svg/logo",
        title: "Tabula",
    },

    formTitle: {
        title: "Регистрация",
    },

    formInput: {
        email: {
            icon: "",
            type: "email",
            placeholder: "Email",
        },
        password: {
            icon: "",
            type: "password",
            placeholder: "Пароль",
        },
        repeatPassword: {
            icon: "",
            type: "password",
            placeholder: "Повторите пароль",
        },
    },
    signHref: {
        url: "signup",
        text: "Уже есть аккаунт?",
    },
    signButton: {
        text: "Зарегистрироваться",
    },
};

const images = new Image(root, signupConfig.images);
images.render();
const location = new Location(root);
location.render();

const sign = document.querySelector(".sign-location");

const mainLogo = new MainLogo(sign, signupConfig.mainLogo);
mainLogo.render();

const formTitle = new FormTitle(sign, signupConfig.formTitle);
formTitle.render();

const form = new FormComponent(sign);
form.render();

const formSelector = document.querySelector(".sign-form");

const inputText = new Input(formSelector, signupConfig.inputs);
inputText.render();

const signHref = new SignHref(formSelector, signupConfig.signHref);
signHref.render();

const signButton = new SignButton(formSelector, signupConfig.signButton);
signButton.render();
