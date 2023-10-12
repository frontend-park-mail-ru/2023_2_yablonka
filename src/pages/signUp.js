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
 * Класс для рендера страницы регистрации
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
export default class SignUp {
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

    constructor(rootElement) {
        this.#root = rootElement;
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        this.#root.innerHTML = '';
        document.title = 'Tabula: Sign Up';

        const logged = await loginRequest();

        if (logged && !('error_response' in logged.body)) {
            history.pushState(null, null, 'desks');
            window.dispatchEvent(new PopStateEvent('popstate'));
            return;
        }

        history.replaceState(null, null, 'signup');

        const pageLayout = new PageLayout(this.#root, { className: 'sign' });
        pageLayout.render();

        const signDecorator = new SignDecorator(this.#root.querySelector(pageLayout.className), {
            leftPicture: 'undraw_performance_overview',
            rightPicture: 'undraw_team_collaboration',
        });
        signDecorator.render();

        const contentHeader = new ContentHeader(
            this.#root.querySelector(SignDecorator.lastWrapperClassName),
            { className: 'sign', title: 'Регистрация' },
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

        const linkButtonSignIn = new LinkButton(this.#root.querySelector(form.className), {
            className: 'signin',
            componentId: 'signin',
            text: 'Уже есть аккаунт?',
        });
        linkButtonSignIn.render();

        const buttonSignUp = new Button(this.#root.querySelector(form.className), {
            className: 'sign',
            type: 'submit',
            formName: 'sign',
            id: 'signUp',
            text: 'Регистрация',
        });
        buttonSignUp.render();

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
                    'Некорректный пароль, он должен состоять из букв и цифр или спец. символов и быть длиннее 8 символов',
                );
            } else if (
                !Validator.validateRepeatPasswords(
                    this.#root.querySelector('input[input-type="password"]').value,
                    this.#root.querySelector('input[input-type="repeat-password"]').value,
                )
            ) {
                errorMessageAnimation('repeatPassword', 'Пароли не совпадают');
            } else {
                const resp = await this.authentificate()
                    .then((res) => res.json())
                    .catch(() => null);
                if (!resp || 'error_response' in resp.body) {
                    errorMessageAnimation('email', 'Что-то пошло не так, попробуйте изменить email');
                } else {
                    history.pushState(null, null, 'desks');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }
            }
        });
        document.querySelector('.link-button_signin').addEventListener('click', (e) => {
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
        const passwInput = document.querySelector('input[input-type="password"]');

        const result = await AJAX('http://localhost:8080/api/v1/auth/signup/', 'POST', {
            email: emailInput.value,
            password: passwInput.value,
        });

        return result;
    };
}
