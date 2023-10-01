"use strict";

import { SignIn } from "./pages/signInPage.js";
import { SignUp } from "./pages/signUpPage.js";

const root = document.querySelector(".page");

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
    }
});

document.querySelector("body").addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("hello");
});
