import PageLayout from '../components/pageLayout/pageLayout.js';
import SignDecorator from '../components/signDecoration/signDecoration.js';
import ContentHeader from '../components/contentHeader/contentHeader.js';
import Form from '../components/form/form.js';
import FormInput from '../components/formInput/formInput.js';
import LinkButton from '../components/linkButton/linkButton.js';
import Button from '../components/button/button.js';
import ErrorMessage from '../components/errorMessage/errorMessage.js';
import AJAX from '../modules/ajax.js';
import Validator from '../modules/validator.js';
import loginRequest from '../modules/loginRequest.js';
import errorMessageAnimation from '../components/core/errorMessageAnimation.js';

/**
 * Класс для рендера страницы логина
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
export default class SignIn {
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

    constructor(rootElement) {
        this.#root = rootElement;
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        this.#root.innerHTML = '';
        document.title = 'Tabula: Sign In';

        const logged = await loginRequest();

        if (logged && !('error_response' in logged.body)) {
            history.pushState(null, null, 'desks');
            window.dispatchEvent(new PopStateEvent('popstate'));
            return;
        }

        history.replaceState(null, null, 'signin');

        const pageLayout = new PageLayout(this.#root, { className: 'sign' });
        pageLayout.render();

        const signDecorator = new SignDecorator(this.#root.querySelector(pageLayout.className), {
            leftPicture: 'undraw_meet_the_team',
            rightPicture: 'undraw_creative_woman',
        });
        signDecorator.render();

        const contentHeader = new ContentHeader(
            this.#root.querySelector(SignDecorator.lastWrapperClassName),
            { className: 'sign', title: 'Вход' },
        );
        contentHeader.render();

        const form = new Form(this.#root.querySelector(SignDecorator.lastWrapperClassName), {
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
                componentId: 'forgotten-password',
                text: 'Забыли пароль?',
            },
        );
        linkButtonForgottenPassword.render();

        const linkButtonRegistration = new LinkButton(this.#root.querySelector(form.className), {
            className: 'registration',
            componentId: 'signup',
            text: 'Регистрация',
        });
        linkButtonRegistration.render();

        const buttonSignIn = new Button(this.#root.querySelector(form.className), {
            className: 'sign',
            type: 'submit',
            formName: 'sign',
            id: 'signIn',
            text: 'Войти',
        });
        buttonSignIn.render();

        this.#addEventListeners();
    }

    /**
     * Добавление обработчиков событий на элементы страницы
     */
    #addEventListeners = () => {
        this.#root.querySelector('.button_sign').addEventListener('click', async (e) => {
            e.preventDefault();
            if (
                !Validator.validateEmail(
                    this.#root.querySelector('input[input-type="email"]').value,
                )
            ) {
                errorMessageAnimation('email', 'Некорректный email');
            } else if (
                !Validator.validatePassword(
                    this.#root.querySelector('input[input-type="password"]').value,
                )
            ) {
                errorMessageAnimation(
                    'password',
                    'Некорректный пароль, он должен состоять из букв и цифр и быть длиннее 8 символов',
                );
            } else {
                const resp = await this.authentificate()
                    .then((res) => res.json())
                    .catch(() => null);
                if (!resp || 'error_response' in resp.body) {
                    errorMessageAnimation(
                        'email',
                        'Что-то пошло не так, попробуйте изменить email',
                    );
                } else {
                    history.pushState(null, null, 'desks');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }
            }
        });
        this.#root.querySelector('.link-button_registration').addEventListener('click', (e) => {
            const href = e.target.getAttribute('id');
            window.history.pushState(null, null, href);
            window.dispatchEvent(new PopStateEvent('popstate'));
        });
    };

    /**
     * Процесс аутентификации
     * @returns {Promise} - Результат запроса
     */
    authentificate = async () => {
        const emailInput = this.#root.querySelector('input[input-type="email"]');
        const passwInput = this.#root.querySelector('input[input-type="password"]');

        const result = await AJAX('http://localhost:8080/api/v1/auth/login/', 'POST', {
            email: emailInput.value,
            password: passwInput.value,
        });

        return result;
    };
}
