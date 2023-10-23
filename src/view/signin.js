import PageLayout from '../components/pageLayout/pageLayout.js';
import SignDecoration from '../components/signDecoration/signDecoration.js';
import ContentHeader from '../components/contentHeader/contentHeader.js';
import Form from '../components/form/form.js';
import FormInput from '../components/formInput/formInput.js';
import LinkButton from '../components/linkButton/linkButton.js';
import Button from '../components/button/button.js';
import ErrorMessage from '../components/errorMessage/errorMessage.js';
import errorMessageAnimation from '../components/core/errorMessageAnimation.js';
import emitter from '../modules/eventEmitter.js';
import dispatcher from '../modules/dispatcher.js';
import { actionToSignUp, actionSignin, actionRedirect } from '../actions/userActions.js';
import userStorage from '../storages/userStorage.js';

/**
 * Класс для рендера страницы логина
 * @class
 */
class SignIn {
    #root;

    #config = {
        formContainer: {
            email: {
                icon: 'person',
                type: 'text',
                placeholder: 'Email',
                inputType: 'email',
            },
            password: {
                icon: 'lock',
                type: 'password',
                placeholder: 'Пароль',
                inputType: 'password',
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
        if (document.title !== '' && window.history.state !== 'Tabula: Sign In') {
            window.history.replaceState(document.title, '', window.location.href);
        }
        document.title = 'Tabula: Sign In';

        const pageLayout = new PageLayout(this.#root, { className: 'sign' });
        pageLayout.render();

        const signDecoration = new SignDecoration(this.#root.querySelector(pageLayout.className), {
            leftPicture: 'undraw_meet_the_team',
            rightPicture: 'undraw_creative_woman',
        });
        signDecoration.render();

        const contentHeader = new ContentHeader(
            this.#root.querySelector(SignDecoration.lastWrapperClassName),
            { className: 'sign', title: 'Вход' },
        );
        contentHeader.render();

        const form = new Form(this.#root.querySelector(SignDecoration.lastWrapperClassName), {
            componentId: 'form-sign',
            className: 'sign',
            url: '/',
            method: 'POST',
            isFile: false,
        });
        form.render();

        Object.entries(this.#config.formContainer).forEach((input) => {
            const formInput = new FormInput(this.#root.querySelector(form.className), {
                className: input[1].inputType,
                icon: input[1].icon,
                type: input[1].type,
                placeholder: input[1].placeholder,
                inputType: input[1].inputType,
            });
            formInput.render();

            const errorMessage = new ErrorMessage(this.#root.querySelector(formInput.className), {
                className: input[0],
            });
            errorMessage.render();
        });

        const linkButtonForgottenPassword = new LinkButton(
            this.#root.querySelector(form.className),
            {
                className: 'forgotten-password',
                href: 'signup',
                text: 'Забыли пароль?',
                disable: true,
            },
        );
        linkButtonForgottenPassword.render();

        const linkButtonRegistration = new LinkButton(this.#root.querySelector(form.className), {
            className: 'signup',
            href: 'signup',
            action: 'load',
            section: '/signup',
            text: 'Регистрация',
            disable: false,
        });
        linkButtonRegistration.render();

        const buttonSignIn = new Button(this.#root.querySelector(form.className), {
            className: 'sign',
            type: 'submit',
            formId: 'form-sign',
            action: 'send',
            id: 'signin',
            text: 'Войти',
        });
        buttonSignIn.render();

        this.addEventListeners();
    }

    /**
     * Добавляет подписки на события
     */
    addEventListeners() {
        this.#root.querySelector('.signup-link').addEventListener('click', this.goSignupHandler);
        this.#root.querySelector('.button-sign').addEventListener('click', this.onSubmitHandler);
    }

    /**
     * Убирает подписки на события
     */
    removeEventListeners() {
        this.#root
            .querySelector('.signup-link')
            .removeEventListener('click', this.goSignupHandler);
        this.#root.querySelector('.button-sign').removeEventListener('click', this.onSubmitHandler);
    }

    /**
     * Хендлер события нажатия на ссылку перехода на регистрацию
     * @param {Event} e - Событие
     */
    goSignupHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionToSignUp());
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
                window.history.replaceState(window.history.state, '', `${window.location.origin}/boards`);
                dispatcher.dispatch(actionRedirect(`${window.location.origin}/boards`, true));
                break;
            case 401:
                errorMessageAnimation('email', 'Неверный логин или пароль');
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

        const loginInput = formInputs.querySelector('input[type=text]');
        const passwordInput = formInputs.querySelector('input[type=password]');

        const user = { email: loginInput.value, password: passwordInput.value };

        await dispatcher.dispatch(actionSignin(user));
    };
}

const signIn = new SignIn();

export default signIn;
