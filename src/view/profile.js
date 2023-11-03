import PageLayout from '../components/pageLayout/pageLayout.js';
import Header from '../components/header/header.js';
import ContainerProfile from '../components/containerProfile/containerProfile.js';
import Form from '../components/form/form.js';
import FormInput from '../components/formInput/formInput.js';
import TextArea from '../components/textArea/textArea.js';
import Button from '../components/button/button.js';
import NavPopup from '../components/navPopup/navPopup.js';
import ChangeAvatarPopup from '../components/changeAvatarPopup/changeAvatarPopup.js';
import { actionRedirect, actionLogout, actionNavigate } from '../actions/userActions.js';
import userStorage from '../storages/userStorage.js';
import emitter from '../modules/eventTrigger.js';
import dispatcher from '../modules/dispatcher.js';

/**
 * Класс для рендера страницы профиля
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
class Profile {
    #root;

    #config = {
        formInput: {
            email: {
                withImage: false,
                type: 'email',
                placeholder: 'Email',
                inputType: 'email',
                className: 'profile',
                disable: true,
            },
            name: {
                withImage: false,
                type: 'text',
                placeholder: 'Имя',
                inputType: 'name',
                className: 'profile',
                disable: false,
            },
            surname: {
                withImage: false,
                type: 'text',
                placeholder: 'Фамилия',
                inputType: 'surname',
                className: 'profile',
                disable: false,
            },
        },
        formInputSecurity: {
            oldPassword: {
                withImage: false,
                type: 'password',
                placeholder: 'Старый пароль',
                inputType: 'old-password',
                className: 'profile',
                disable: false,
            },
            newPassword: {
                withImage: false,
                type: 'password',
                placeholder: 'Новый пароль',
                inputType: 'new-password',
                className: 'profile',
                disable: false,
            },
            surname: {
                withImage: false,
                type: 'password',
                placeholder: 'Повторите новый пароль',
                inputType: 'repeat-new-password',
                className: 'profile',
                disable: false,
            },
        },
    };

    /**
     * @constructor
     */
    constructor() {
        this.#root = document.querySelector('.page');
        emitter.bind('profile', this.renderProfile.bind(this));
        emitter.bind('security', this.renderSecurity.bind(this));
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        document.title = 'Tabula: Profile';

        const user = userStorage.storage.get(userStorage.userModel.body);

        const pageLayout = new PageLayout(this.#root, { className: 'profile' });
        pageLayout.render();

        const header = new Header(this.#root.querySelector(pageLayout.className), {
            user: { avatar: user.body.user.thumbnail_url },
        });
        header.render();

        const namesurname = `${user.body.user.name ? user.body.user.name : ''} ${
            user.body.user.surname ? user.body.user.surname : ''
        }`;

        const navPopup = new NavPopup(this.#root, {
            email: user.body.user.email,
            avatar: user.body.user.thumbnail_url,
            name: namesurname,
        });
        navPopup.render();

        const changeAvatarPopup = new ChangeAvatarPopup(this.#root, {
            path: window.location.pathname,
        });
        changeAvatarPopup.render();

        const containerProfile = new ContainerProfile(
            this.#root.querySelector(pageLayout.className),
            {
                avatar: user.body.user.thumbnail_url,
                nameSurname: namesurname,
            },
        );
        containerProfile.render();

        if (window.location.pathname === '/profile') {
            this.renderProfile();
        } else if (window.location.pathname === '/security') {
            this.renderSecurity();
        }

        this.addListeners();
    }

    renderProfile() {
        this.#root
            .querySelector('.profile-navigation__security')
            .classList.remove('profile-navigation_active');
        const userInfoContainer = this.#root.querySelector('.container-profile__user-information');
        userInfoContainer.innerHTML = '';

        const form = new Form(userInfoContainer, {
            componentId: 'form-profile',
            className: 'profile',
            url: '/profile',
            method: 'PATCH',
            isFile: false,
        });
        form.render();

        Object.entries(this.#config.formInput).forEach((input) => {
            const formInput = new FormInput(this.#root.querySelector(form.className), {
                className: input[1].className,
                type: input[1].type,
                placeholder: input[1].placeholder,
                inputType: input[1].inputType,
                withImage: input[1].withImage,
                disable: input[1].disable,
                text: userStorage.storage.get(userStorage.userModel.body).body.user[
                    input[1].inputType
                ],
            });
            formInput.render();
        });

        const textArea = new TextArea(this.#root.querySelector(form.className), {
            className: 'profile',
            length: 1024,
            rows: 50,
            columns: 100,
            placeholder: 'О себе...',
        });
        textArea.render();

        const buttonChangeData = new Button(userInfoContainer, {
            className: 'profile-save',
            type: 'submit',
            formId: 'form-profile',
            action: 'send',
            id: 'save-profile-button',
            text: 'Сохранить',
        });
        buttonChangeData.render();
        this.#root
            .querySelector('.profile-navigation__user-information')
            .classList.add('profile-navigation_active');
    }

    goSecurityHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.href, '', true));
        dispatcher.dispatch(actionNavigate(`${window.location.origin}/security`, '', false));
        emitter.trigger('security');
    }

    goProfileHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.href, '', true));
        dispatcher.dispatch(actionNavigate(`${window.location.origin}/profile`, '', false));
        emitter.trigger('profile');
    }

    renderSecurity() {
        this.#root
            .querySelector('.profile-navigation__user-information')
            .classList.remove('profile-navigation_active');

        const userInfoContainer = this.#root.querySelector('.container-profile__user-information');

        userInfoContainer.innerHTML = '';

        const form = new Form(userInfoContainer, {
            componentId: 'form-profile',
            className: 'profile',
            url: '/security',
            method: 'PATCH',
            isFile: false,
        });
        form.render();

        Object.entries(this.#config.formInputSecurity).forEach((input) => {
            const formInput = new FormInput(this.#root.querySelector(form.className), {
                className: input[1].className,
                type: input[1].type,
                placeholder: input[1].placeholder,
                inputType: input[1].inputType,
                withImage: input[1].withImage,
                disable: input[1].disable,
            });
            formInput.render();
        });

        const buttonChangeData = new Button(userInfoContainer, {
            className: 'profile-save',
            type: 'submit',
            formId: 'form-profile',
            action: 'send',
            id: 'save-profile-button',
            text: 'Сменить пароль',
        });
        buttonChangeData.render();

        this.#root
            .querySelector('.profile-navigation__security')
            .classList.add('profile-navigation_active');
    }

    /**
     * Добавляет общие обработчики событий
     */
    addListeners() {
        this.#root.querySelector('.profile-link').addEventListener('click', this.goProfileHandler);
        this.#root
            .querySelector('.security-link')
            .addEventListener('click', this.goSecurityHandler);
        this.#root.querySelector('.boards-link').addEventListener('click', this.toMainPageHandler);
        this.#root
            .querySelector('.profile-navigation__security')
            .addEventListener('click', this.goSecurityHandler);

        this.#root
            .querySelector('.profile-navigation__user-information')
            .addEventListener('click', this.goProfileHandler);

        this.#root.querySelector('.log-out-link').addEventListener('click', this.logoutHandler);

        this.#root
            .querySelector('.header-menu__logo')
            .addEventListener('click', this.toMainPageHandler);
        emitter.bind('logout', this.close);
    }

    /**
     * Убирает общие обработчики событий
     */
    removeListeners() {
        this.#root.querySelector('.profile-link').removeEventListener('click', this.renderProfile);
        this.#root
            .querySelector('.security-link')
            .removeEventListener('click', this.renderSecurity);
        this.#root
            .querySelector('.boards-link')
            .removeEventListener('click', this.toMainPageHandler);
        this.#root
            .querySelector('.profile-navigation__security')
            .removeEventListener('click', this.goSecurityHandler);

        this.#root
            .querySelector('.profile-navigation__user-information')
            .removeEventListener('click', this.goProfileHandler);

        this.#root.querySelector('.log-out-link').removeEventListener('click', this.logoutHandler);

        this.#root
            .querySelector('.header-menu__logo')
            .removeEventListener('click', this.toMainPageHandler);
        emitter.unbind('logout', this.close);
    }

    /**
     * Handler события нажатия на ссылку для перехода на log out
     * @param {Event} e - Событие
     */
    logoutHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionLogout());
    }

    toMainPageHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.href, '', true));
        dispatcher.dispatch(actionRedirect(`${window.location.origin}/boards`, false));
    }

    /**
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.href, '', true));
        dispatcher.dispatch(actionRedirect(`${window.location.origin}/signin`, false));
    }

    /**
     * Очистка страницы
     */
    clear() {
        this.removeListeners();
        this.#root.innerHTML = '';
    }
}

const profile = new Profile();

export default profile;
