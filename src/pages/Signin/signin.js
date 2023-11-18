// components
import Component from '../../components/core/basicComponent.js';
import Form from '../../components/Signin/form/form.js';
import Link from '../../components/atomic/link/link.js';
import Button from '../../components/atomic/button/button.js';
// routing
import dispatcher from '../../modules/dispatcher.js';
import { actionNavigate, actionRedirect, actionSignin } from '../../actions/userActions.js';
// utils
import Validator from '../../modules/validator.js';
import NotificationMessage from '../../components/Common/notification/notificationMessage.js';
// template and styles
import template from './signin.hbs';
import './signin.scss';

/**
 * Компонент страницы входа
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Signin extends Component {
    #innerConfig = {
        signupLink: {
            class: 'sign',
            href: '/signup',
            action: 'to-signup',
            text: 'Регистрация',
            disabled: false,
        },
        loginBtn: {
            type: 'submit',
            action: 'login',
            class: 'sign',
            formId: 'form-sign',
            text: 'Войти',
        },
    };

    /**
     * Рендерит компонент в DOM
     */
    render() {
        const page = template({
            form: new Form(null, {}).render(),
            signupLink: new Link(null, this.#innerConfig.signupLink).render(),
            loginBtn: new Button(null, this.#innerConfig.loginBtn).render(),
        });

        this.parent.insertAdjacentHTML('beforeend', page);
    }

    /**
     * Добавляет подписки на события
     */
    addEventListeners() {
        this.parent.querySelector('.sign-link').addEventListener('click', this.goSignupHandler);
        this.parent.querySelector('.btn-sign').addEventListener('click', this.onSubmitHandler);
    }

    /**
     * Убирает подписки на события
     */
    removeEventListeners() {
        this.parent.querySelector('.sign-link').removeEventListener('click', this.goSignupHandler);
        this.parent.querySelector('.btn-sign').removeEventListener('click', this.onSubmitHandler);
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
     * Handler события нажатия на кнопку логина
     * @param {Event} e - Событие
     */
    onSubmitHandler = async (e) => {
        e.preventDefault();

        const loginInput = this.parent.querySelector('input[data-name=email]');
        const passwordInput = this.parent.querySelector('input[data-name=password]');

        const user = { email: loginInput.value, password: passwordInput.value };

        if (!Validator.validateEmail(user.email)) {
            NotificationMessage.showNotification(
                this.parent.querySelector('.input[data-name="email"]').parentNode,
                false,
                true,
                { fontSize: 14, fontWeight: 200, text: 'Неккоректный email' },
            );
        } else if (!Validator.validatePassword(user.password)) {
            NotificationMessage.showNotification(
                this.parent.querySelector('.input[data-name="password"]').parentNode,
                false,
                true,
                {
                    fontSize: 14,
                    fontWeight: 200,
                    text: 'Неккоректный пароль. Пароль должен может содержать лишь латинские буквы, цифры, спецсимволы и быть длиннее 8 символов',
                },
            );
        } else {
            await dispatcher.dispatch(actionSignin(user));
        }
    };
}
