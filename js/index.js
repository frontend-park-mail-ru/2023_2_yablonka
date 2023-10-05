import { YourDesks } from "/pages/yourDesks.js";
import { SignIn } from "/pages/signIn.js";
import { SignUp } from "/pages/signUp.js";
import { loginCheck } from "./components/core/routing/loginCheck.js";

const root = document.querySelector(".page");
let pathname = window.location.pathname;

const yourDesksPage = new YourDesks(root);
const signUpPage = new SignUp(root);
const signInPage = new SignIn(root);

if (pathname == "/signin") {
    signInPage.renderPage();
} else if (pathname == "/signup") {
    signUpPage.renderPage();
} else if (pathname == "/desks") {
    yourDesksPage.renderPage();
} else {
    signInPage.renderPage();
}

window.addEventListener("popstate", () => {
    pathname = window.location.pathname;
    if (pathname == "/signin") {
        signInPage.renderPage();
    } else if (pathname == "/signup") {
        signUpPage.renderPage();
    } else if (pathname == "/") {
        signIpPage.renderPage();
    } else if (pathname == "/desks") {
        yourDesksPage.renderPage();
    }
});
