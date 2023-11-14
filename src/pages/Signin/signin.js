import Component from '../../components/core/basicComponent.js';
import Form from '../../components/Signin/form/form.js';
import Link from '../../components/atomic/link/link.js';
import Button from '../../components/atomic/button/button.js';
import dispatcher from '../../modules/dispatcher.js';
import { actionNavigate, actionRedirect, actionSignin } from '../../actions/userActions.js';
import template from './signin.hbs';
import './signin.scss';

/**
 * Компонент страницы входа
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Signin extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    #innerConfig = {
        forgottenPasswordLink: {
            class: 'forgotten-password',
            href: '/remember-password',
            action: 'to-remember-password',
            text: 'Забыли пароль?',
            disabled: true,
        },
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
            forgottenPasswordLink: new Link(null, this.#innerConfig.forgottenPasswordLink).render(),
            signupLink: new Link(null, this.#innerConfig.signupLink).render(),
            loginBtn: new Button(null, this.#innerConfig.loginBtn).render(),
        });

        this.parent.insertAdjacentHTML('beforeend', page);
    }

    /**
     * Добавляет подписки на события
     */
    addEventListeners() {
        document.querySelector('.sign-link').addEventListener('click', this.goSignupHandler);
        document.querySelector('.btn-sign').addEventListener('click', this.onSubmitHandler);
    }

    /**
     * Убирает подписки на события
     */
    removeEventListeners() {
        document.querySelector('.sign-link').removeEventListener('click', this.goSignupHandler);
        document.querySelector('.btn-sign').removeEventListener('click', this.onSubmitHandler);
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

        const loginInput = document.querySelector('input[data-name=email]');
        const passwordInput = document.querySelector('input[data-name=password]');

        const user = { email: loginInput.value, password: passwordInput.value };

        await dispatcher.dispatch(actionSignin(user));
    };
}
