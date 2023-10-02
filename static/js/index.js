"use strict";

import { SignIn } from "./pages/signInPage.js";
import { SignUp } from "./pages/signUpPage.js";
import { YourDesks } from "./pages/yourDesksPage.js";

const root = document.querySelector(".page");

const yd = new YourDesks(root);
const signUpPage = new SignUp(root);
const signInPage = new SignIn(root);
signInPage.renderPage();

document.querySelector("body").addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.tagName != "A") return;

    const ref = e.target;
    const link = ref.getAttribute("href");
    if (link == "signup.html") {
        signUpPage.renderPage();
        history.pushState(null, null, "signup");
    } else if (link == "signin.html") {
        signInPage.renderPage();
        history.pushState(null, null, "signin");
    } else if (link == "desk_list.html") {
        yd.renderPage();
        history, pushState(null, null, "mydesks");
    }
});

document.querySelector("body").addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("hello");
});
