import PageLayout from '../components/pageLayout/pageLayout.js';
import SignDecoration from '../components/signDecoration/signDecoration.js';
import ContentHeader from '../components/contentHeader/contentHeader.js';
import Form from '../components/form/form.js';
import FormInput from '../components/formInput/formInput.js';
import LinkButton from '../components/linkButton/linkButton.js';
import Button from '../components/button/button.js';
import ErrorMessage from '../components/errorMessage/errorMessage.js';
import Validator from '../modules/validator.js';
import errorMessageAnimation from '../components/core/errorMessageAnimation.js';
import emitter from '../modules/eventEmitter.js';
import dispatcher from '../modules/dispatcher.js';
import { actionToSignIn, actionSignup, actionRedirect } from '../actions/userActions.js';
import userStorage from '../storages/userStorage.js';

/**
 * Класс для рендера страницы регистрации
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
class SignUp {
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
            repeat_password: {
                icon: 'key',
                type: 'password',
                placeholder: 'Повторите пароль',
                inputType: 'repeat-password',
            },
        },
    };

    constructor() {
        this.#root = document.querySelector('.page');

        emitter.bind('signup', this.listenSignUpAction.bind(this));

        emitter.bind('renderSignup', this.listenSignUpRender.bind(this));
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        this.#root.innerHTML = '';
        document.title = 'Tabula: Sign Up';

        history.replaceState(null, null, 'signup');

        const pageLayout = new PageLayout(this.#root, { className: 'sign' });
        pageLayout.render();

        const signDecorator = new SignDecoration(this.#root.querySelector(pageLayout.className), {
            leftPicture: 'undraw_performance_overview',
            rightPicture: 'undraw_team_collaboration',
        });
        signDecorator.render();

        const contentHeader = new ContentHeader(
            this.#root.querySelector(SignDecoration.lastWrapperClassName),
            { className: 'sign', title: 'Регистрация' },
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
                className: input[1].inputType,
            });
            errorMessage.render();
        });

        const linkButtonSignIn = new LinkButton(this.#root.querySelector(form.className), {
            className: 'signin',
            href: 'signin',
            text: 'Уже есть аккаунт?',
            disable: false,
        });
        linkButtonSignIn.render();

        const buttonSignUp = new Button(this.#root.querySelector(form.className), {
            className: 'sign',
            type: 'submit',
            formName: 'sign',
            id: 'signup',
            text: 'Регистрация',
        });
        buttonSignUp.render();

        this.addEventListeners();
    }

    addEventListeners() {
        this.#root.querySelector('.signin-link').addEventListener('click', this.goSignupHandler);

        this.#root.querySelector('.button-sign').addEventListener('click', this.onSubmitHandler);
    }

    removeEventListeners() {
        this.#root.querySelector('.signin-link').removeEventListener('click', this.goSignupHandler);

        this.#root.querySelector('.button-sign').removeEventListener('click', this.onSubmitHandler);
    }

    goSignupHandler(e) {
        e.preventDefault();

        dispatcher.dispatch(actionToSignIn());
    }

    clear() {
        document.querySelectorAll('div.layout').forEach((e) => {
            e.remove();
        });
    }

    listenSignUpRender = () => {
        this.clear();
        this.renderPage();
    };

    listenSignUpAction() {
        const status = userStorage.storage.get(userStorage.userModel.status);
        const body = userStorage.storage.get(userStorage.userModel.body);
        switch (status) {
            case 200:
                this.removeEventListeners();
                this.clear();
                dispatcher.dispatch(actionRedirect('/boards', true, false));
                break;
            case 401:
                errorMessageAnimation('email', 'Произошла ошибка. Пожалуйста, попробуйте ещё раз');
                break;
            case 409:
                errorMessageAnimation('email', 'Пользователь c таким email уже существует');
                break;
            default:
                break;
        }
    }

    onSubmitHandler = async (e) => {
        e.preventDefault();
        const data = document.querySelector('.form-sign');
        const loginForm = data.querySelector('input[input-type=email]');
        const passwordForm = data.querySelector('input[input-type=password]');
        const repeatPasswordForm = data.querySelector('input[input-type=repeat-password]');

        const user = {};
        user.email = loginForm.value;
        user.password = passwordForm.value;

        if (!Validator.validateEmail(user.email)) {
            errorMessageAnimation('email', 'Введён неккоректный email');
        } else if (!Validator.validatePassword(user.password)) {
            errorMessageAnimation(
                'password',
                'Пароль должен состоять из букв, цифр и быть не менее 8 символов',
            );
        } else if (!Validator.validateRepeatPasswords(user.password, repeatPasswordForm.value)) {
            errorMessageAnimation('repeat-password', 'Пароли не совпадают');
        } else {
            await dispatcher.dispatch(actionSignup(user));
        }
    };
}

const signUp = new SignUp();

export default signUp;
