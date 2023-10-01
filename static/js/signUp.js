"use strict";

import { SignIn } from "./pages/signInPage.js";
import { SignUp } from "./pages/signUpPage.js";


const root = document.querySelector(".page");

const signUpPage = new SignUp(root);
const signInPage = new SignIn(root);
signUpPage.renderPage();

document.querySelector("body").addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.tagName != "A") return;

    const ref = e.target;
    const link = ref.getAttribute("href");
    if (link == "signup.html") {
        signUpPage.renderPage();
    } else if (link == "signin.html") {
        const signin = new SignIn(root);
        signInPage.renderPage();
    }
});
