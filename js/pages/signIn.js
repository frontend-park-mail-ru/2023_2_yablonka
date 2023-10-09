import PageImage from '../components/signComponents/page__image/page__image.js';
import SignLocation from '../components/signComponents/sign-location/sign-location.js';
import SignLocationHeader from '../components/signComponents/sign-location__header/sign-location__header.js';
import SignLocationHeaderTitle from '../components/signComponents/sign-location__header-title/sign-location__header-title.js';
import SignForm from '../components/signComponents/sign-form/sign-form.js';
import SignFormContainer from '../components/signComponents/sign-form__container/sign-form__container.js';
import HrefForgottenPassword from '../components/signComponents/href-forgotten-password/href-forgotten-password.js';
import HrefSign from '../components/signComponents/href-sign/href-sign.js';
import ButtonSign from '../components/signComponents/button-sign/button-sign.js';
import ErrorMessage from '../components/signComponents/error-message/error-message.js';
import AJAX from '../components/core/ajax/ajax.js';
import Validator from '../components/core/validation/validator.js';
import loginCheck from '../components/core/routing/loginCheck.js';
import errorMessage from '../components/core/signErrorMessage/errorMessage.js';

/**
 * Класс для рендера страницы логина
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */

export default class SignIn {
    #root;

    constructor(rootElement) {
        this.#root = rootElement;
    }

    signinConfig = {
        images: {
            left: {
                side: 'left',
                picture: 'undraw_meet_the_team',
            },
            right: {
                side: 'right',
                picture: 'undraw_creative_woman',
            },
        },
        signFormContainer: {
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
        signLocationHeader: {
            signLocationHeader: {
                logo: 'logo',
                title: 'Tabula',
            },
        },
        signLocationHeaderTitle: {
            signLocationHeaderTitle: {
                title: 'Вход',
            },
        },

        hrefForgottenPassword: {
            hrefForgottenPassword: {
                text: 'Забыли пароль?',
            },
        },

        signHref: {
            signHref: {
                url: 'signup',
                text: 'Регистрация',
            },
        },

        buttonSign: {
            buttonSign: {
                text: 'Войти',
                id: 'signin',
            },
        },
    };

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        this.#root.innerHTML = '';
        this.#root.style.backgroundColor = '#37426d';
        document.title = 'Tabula: Sign In';

        const logged = await loginCheck();

        if (logged && !('error_response' in logged.body)) {
            history.pushState(null, null, 'desks');
            window.dispatchEvent(new PopStateEvent('popstate'));
            return;
        }

        history.replaceState(null, null, 'signin');

        const pageImage = new PageImage(this.#root, this.signinConfig.images);
        pageImage.render();

        const signLocation = new SignLocation(this.#root);
        signLocation.render();

        const signLocationElement = document.querySelector('.sign-location');

        const signLocationHeader = new SignLocationHeader(
            signLocationElement,
            this.signinConfig.signLocationHeader,
        );
        signLocationHeader.render();

        const signLocationHeaderTitle = new SignLocationHeaderTitle(
            signLocationElement,
            this.signinConfig.signLocationHeaderTitle,
        );
        signLocationHeaderTitle.render();

        const signForm = new SignForm(signLocationElement);
        signForm.render();

        const signFormElement = document.querySelector('.sign-form');

        const signFormContainer = new SignFormContainer(
            signFormElement,
            this.signinConfig.signFormContainer,
        );
        signFormContainer.render();

        const signFormInputs = document.querySelectorAll('.sign-form__container');
        signFormInputs.forEach((input) => {
            const errMessage = new ErrorMessage(input);
            errMessage.render();
        });

        const hrefForgottenPassword = new HrefForgottenPassword(
            signFormElement,
            this.signinConfig.hrefForgottenPassword,
        );
        hrefForgottenPassword.render();

        const hrefSign = new HrefSign(signFormElement, this.signinConfig.signHref);
        hrefSign.render();

        const buttonSign = new ButtonSign(signFormElement, this.signinConfig.buttonSign);
        buttonSign.render();
        SignIn.#addEventListeners();
    }

    /**
     * Навешивание обработчиков событий на элементы страницы
     */

    static #addEventListeners() {
        document.querySelector('.button-sign').addEventListener('click', async (e) => {
            e.preventDefault();
            const data = document.querySelectorAll('.sign-form__input');
            if (!Validator.validateEmail(data[0].value)) {
                errorMessage('email', 'Некорректный email');
            } else if (!Validator.validatePassword(data[1].value)) {
                errorMessage(
                    'password',
                    'Некорректный пароль, он должен состоять из букв и цифр и быть длиннее 8 символов',
                );
            } else {
                const resp = await SignIn.authentificate()
                    .then((res) => res.json())
                    .catch(() => null);
                if (!resp || 'error_response' in resp.body) {
                    errorMessage('email', 'Что-то пошло не так, попробуйте изменить email');
                } else {
                    history.pushState(null, null, 'desks');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }
            }
        });
        document.querySelector('.href-sign').addEventListener('click', (e) => {
            const href = e.target.getAttribute('id');
            history.pushState(null, null, href);
            window.dispatchEvent(new PopStateEvent('popstate'));
        });
    }

    /**
     * Аутентифицирует данные
     * @returns {Promise} - Результат запроса
     */

    static async authentificate() {
        const emailInput = document.querySelector('input[input-type="email"]');
        const passwInput = document.querySelector('input[input-type="password"]');

        const result = await AJAX('http://localhost:8080/api/v1/auth/login/', 'POST', {
            email: emailInput.value,
            password: passwInput.value,
        });

        return result;
    }
}
