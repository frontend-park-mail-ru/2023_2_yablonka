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
import emitter from '../modules/eventTrigger.js';
import dispatcher from '../modules/dispatcher.js';
import {
    actionToSignIn,
    actionSignup,
    actionRedirect,
    actionNavigate,
} from '../actions/userActions.js';
import userStorage from '../storages/userStorage.js';

/**
 * Класс для рендера страницы регистрации
 * @class
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

    /**
     * @constructor
     */
    constructor() {
        this.#root = document.querySelector('.page');

        emitter.bind('signup', this.listenSignUpAction.bind(this));
        emitter.bind('renderSignup', this.renderPage.bind(this));
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        this.clear();

        document.title = 'Tabula: Sign Up';

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
                withImage: true,
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
            action: 'load',
            section: '/signin',
            text: 'Уже есть аккаунт?',
            disable: false,
        });
        linkButtonSignIn.render();

        const buttonSignUp = new Button(this.#root.querySelector(form.className), {
            className: 'sign',
            type: 'submit',
            formName: 'sign',
            action: 'send',
            id: 'signup',
            text: 'Регистрация',
        });
        buttonSignUp.render();

        this.addEventListeners();
    }

    /**
     * Добавляет подписки на события
     */
    addEventListeners() {
        this.#root.querySelector('.signin-link').addEventListener('click', this.goSigninHandler);
        this.#root.querySelector('.button-sign').addEventListener('click', this.onSubmitHandler);
    }

    /**
     * Убирает подписки на события
     */
    removeEventListeners() {
        this.#root.querySelector('.signin-link').removeEventListener('click', this.goSigninHandler);
        this.#root.querySelector('.button-sign').removeEventListener('click', this.onSubmitHandler);
    }

    /**
     * Хендлер события нажатия на ссылку перехода на логин
     * @param {Event} e - Событие
     */
    goSigninHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.href, '', true));
        dispatcher.dispatch(actionToSignIn());
        dispatcher.dispatch(actionNavigate(e.target.href, '', false));
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
    listenSignUpAction() {
        const status = userStorage.storage.get(userStorage.userModel.status);
        switch (status) {
            case 200:
                this.removeEventListeners();
                this.clear();
                dispatcher.dispatch(actionNavigate(window.location.href, '', true));
                dispatcher.dispatch(actionRedirect(`${window.location.origin}/boards`, true));
                dispatcher.dispatch(actionNavigate(`${window.location.origin}/boards`, '', false));
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

    /**
     * Handler события нажатия на кнопку регистрации
     * @param {Event} e - Событие
     */
    onSubmitHandler = async (e) => {
        e.preventDefault();
        const formInputs = this.#root.querySelector('.form-sign');

        const loginInput = formInputs.querySelector('input[input-type=email]');
        const passwordInput = formInputs.querySelector('input[input-type=password]');
        const repeatPasswordInput = formInputs.querySelector('input[input-type=repeat-password]');

        const user = { email: loginInput.value, password: passwordInput.value };

        if (!Validator.validateEmail(user.email)) {
            errorMessageAnimation('email', 'Введён неккоректный email');
        } else if (!Validator.validatePassword(user.password)) {
            errorMessageAnimation(
                'password',
                'Пароль должен состоять из букв, цифр и быть не менее 8 символов',
            );
        } else if (!Validator.validateRepeatPasswords(user.password, repeatPasswordInput.value)) {
            errorMessageAnimation('repeat-password', 'Пароли не совпадают');
        } else {
            await dispatcher.dispatch(actionSignup(user));
        }
    };
}

const signUp = new SignUp();

export default signUp;
