// components
import PageLayout from '../components/pageLayout/pageLayout.js';
import SignDecoration from '../components/containerSign/containerSign.js';
import Form from '../components/basic/form/form.js';
import FormInput from '../components/basic/formInput/formInput.js';
import LinkButton from '../components/basic/linkButton/linkButton.js';
import Button from '../components/basic/button/button.js';
import ErrorMessage from '../components/errorMessage/errorMessage.js';
import errorMessageAnimation from '../components/core/errorMessageAnimation.js';
// storages
import userStorage from '../storages/userStorage.js';
// actions
import { actionSignin, actionRedirect, actionNavigate } from '../actions/userActions.js';
// routing
import emitter from '../modules/actionTrigger.js';
import dispatcher from '../modules/dispatcher.js';

/**
 * Класс для рендера страницы логина
 * @class
 */
class SignIn {
    #root;

    #config = {
        formInput: {
            email: {
                withImage: true,
                icon: 'person',
                type: 'text',
                placeholder: 'Email',
                dataName: 'email',
                className: 'sign-email',
                disable: false,
            },
            password: {
                withImage: true,
                icon: 'lock',
                type: 'password',
                placeholder: 'Пароль',
                dataName: 'password',
                className: 'sign-email',
                disable: false,
            },
        },
    };

    /**
     * @constructor
     */
    constructor() {
        this.#root = document.querySelector('.page');

        emitter.bind('signin', this.listenSignInAction.bind(this));
        emitter.bind('renderSignin', this.renderPage.bind(this));
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        this.clear();

        document.title = 'Tabula: Sign In';

        const pageLayout = new PageLayout(this.#root, { className: 'sign' });
        pageLayout.render();

        const signDecoration = new SignDecoration(this.#root.querySelector(pageLayout.className), {
            leftPicture: 'undraw_creative_woman',
            rightPicture: 'undraw_meet_the_team',
        });
        signDecoration.render();

        const form = new Form(this.#root.querySelector(SignDecoration.lastWrapperClassName), {
            componentId: 'form-sign',
            className: 'sign',
            url: '/',
            method: 'POST',
            isFile: false,
        });
        form.render();

        Object.entries(this.#config.formInput).forEach((input) => {
            const formInput = new FormInput(this.#root.querySelector(form.className), {
                className: 'sign',
                icon: input[1].icon,
                type: input[1].type,
                placeholder: input[1].placeholder,
                dataName: input[1].dataName,
                withImage: true,
                text: '',
            });
            formInput.render();
        });

        const errorMessage = new ErrorMessage(
            this.#root.querySelectorAll('.form__input-sign')[0],
            {
                className: 'sign',
                errorName: 'login-or-password',
                success: false,
            },
        );
        errorMessage.render();

        const linkButtonForgottenPassword = new LinkButton(
            this.#root.querySelector(SignDecoration.lastWrapperClassName),
            {
                className: 'forgotten-password',
                href: 'signup',
                text: 'Забыли пароль?',
                disable: true,
            },
        );
        linkButtonForgottenPassword.render();

        const linkButtonRegistration = new LinkButton(
            this.#root.querySelector(SignDecoration.lastWrapperClassName),
            {
                className: 'sign',
                href: 'signup',
                action: 'load',
                text: 'Регистрация',
                disable: false,
            },
        );
        linkButtonRegistration.render();

        const buttonSignIn = new Button(
            this.#root.querySelector(SignDecoration.lastWrapperClassName),
            {
                className: 'sign',
                type: 'submit',
                formId: 'form-sign',
                action: 'send',
                text: 'Войти',
            },
        );
        buttonSignIn.render();

        this.addEventListeners();
    }

    /**
     * Добавляет подписки на события
     */
    addEventListeners() {
        this.#root.querySelector('.sign-link').addEventListener('click', this.goSignupHandler);
        this.#root.querySelector('.btn-sign').addEventListener('click', this.onSubmitHandler);
    }

    /**
     * Убирает подписки на события
     */
    removeEventListeners() {
        this.#root.querySelector('.sign-link').removeEventListener('click', this.goSignupHandler);
        this.#root.querySelector('.btn-sign').removeEventListener('click', this.onSubmitHandler);
    }

    /**
     * Хендлер события нажатия на ссылку перехода на регистрацию
     * @param {Event} e - Событие
     */
    goSignupHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/signup', false));
    }

    /**
     * Очистка страницы
     */
    clear() {
        this.#root.innerHTML = '';
    }

    /**
     * Функция реагирующая на событие renderSignup, которое прокидывается через eventEmitter
     */
    listenSignInAction() {
        const status = userStorage.storage.get(userStorage.userModel.status);
        switch (status) {
            case 200:
                this.removeEventListeners();
                this.clear();
                dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
                dispatcher.dispatch(actionRedirect('/main', false));
                break;
            case 401:
                errorMessageAnimation('sign', 'login-or-password', 'Неверный логин или пароль');
                break;
            default:
                break;
        }
    }

    /**
     * Handler события нажатия на кнопку логина
     * @param {Event} e - Событие
     */
    onSubmitHandler = async (e) => {
        e.preventDefault();
        const formInputs = this.#root.querySelector('.form-sign');

        const loginInput = formInputs.querySelector('input[data-name=email]');
        const passwordInput = formInputs.querySelector('input[data-name=password]');

        const user = { email: loginInput.value, password: passwordInput.value };

        await dispatcher.dispatch(actionSignin(user));
    };
}

const signIn = new SignIn();

export default signIn;
