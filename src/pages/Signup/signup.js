import Component from '../../components/core/basicComponent.js';
import Form from '../../components/Signup/form/form.js';
import Link from '../../components/atomic/link/link.js';
import Button from '../../components/atomic/button/button.js';
import dispatcher from '../../modules/dispatcher.js';
import { actionNavigate, actionRedirect, actionSignup } from '../../actions/userActions.js';
import Validator from '../../modules/validator.js';
import template from './signup.hbs';
import './signup.scss';
import emitter from '../../modules/actionTrigger.js';

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
            href: '/signin',
            action: 'to-signup',
            text: 'Уже есть аккаунт?',
            disabled: false,
        },
        registrationBtn: {
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
            registrationBtn: new Button(null, this.#innerConfig.registrationBtn).render(),
        });

        this.parent.insertAdjacentHTML('beforeend', page);
    }

    /**
     * Добавляет подписки на события
     */
    addEventListeners() {
        this.parent.querySelector('.sign-link').addEventListener('click', this.goSigninHandler);
        this.parent.querySelector('.btn-sign').addEventListener('click', this.onSubmitHandler);
    }

    /**
     * Убирает подписки на события
     */
    removeEventListeners() {
        this.parent.querySelector('.sign-link').removeEventListener('click', this.goSigninHandler);
        this.parent.querySelector('.btn-sign').removeEventListener('click', this.onSubmitHandler);
    }

    /**
     * Хендлер события нажатия на ссылку перехода на логин
     * @param {Event} e - Событие
     */
    goSigninHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/signin', false));
    }

    /**
     * Handler события нажатия на кнопку регистрации
     * @param {Event} e - Событие
     */
    onSubmitHandler = async (e) => {
        e.preventDefault();

        const loginInput = this.parent.querySelector('input[data-name=email]');
        const passwordInput = this.parent.querySelector('input[data-name=password]');
        const repeatPasswordInput = this.parent.querySelector('input[data-name=repeat-password]');

        const user = { email: loginInput.value, password: passwordInput.value };

        if (!Validator.validateEmail(user.email)) {
        } else if (!Validator.validatePassword(user.password)) {
        } else if (!Validator.validateRepeatPasswords(user.password, repeatPasswordInput.value)) {
        } else {
            await dispatcher.dispatch(actionSignup(user));
        }
    };
}
