import {
    actionLogout,
    actionNavigate,
    actionRedirect,
    actionUpdatePassword,
    actionUpdateProfile,
} from '../../actions/userActions.js';
import Header from '../../components/Common/header/header.js';
import Component from '../../components/core/basicComponent.js';
import UserAvatar from '../../components/Profile/userAvatar/userAvatar.js';
import UserInformation from '../../components/Profile/userInformation/userInformation.js';
import UserSecurity from '../../components/Profile/userSecurity/userSecurity.js';
import emitter from '../../modules/actionTrigger.js';
import dispatcher from '../../modules/dispatcher.js';
import Validator from '../../modules/validator.js';
import userStorage from '../../storages/userStorage.js';

import template from './profile.hbs';
import './profile.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class PageLayoutMain extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        let userProfile;

        if (this.config.information) {
            userProfile = new UserInformation(null, {
                email: this.config.email,
                name: this.config.name,
                surname: this.config.surname,
                description: this.config.description,
            }).render();
        } else {
            userProfile = new UserSecurity(null, {}).render();
        }

        this.parent.insertAdjacentHTML(
            'beforeend',
            template({
                header: new Header(null, { avatar: this.config.avatar_url }).render(),
                userAvatar: new UserAvatar(null, {
                    avatar: this.config.avatar_url,
                    name: this.config.name,
                    surname: this.config.surname,
                    email: this.config.email,
                }).render(),
                userProfile,
                information: this.config.information,
            }),
        );
    }

    /**
     * Добавляет общие обработчики событий
     */
    addEventListeners() {
        this.parent
            .querySelector('.profile-link[data-action=profile]')
            .addEventListener('click', this.goProfileHandler);
        this.parent
            .querySelector('.profile-link[data-action=security]')
            .addEventListener('click', this.goSecurityHandler);
        this.parent
            .querySelector('.profile-link[data-action=boards]')
            .addEventListener('click', this.toMainPageHandler);
        this.parent
            .querySelector('.profile-link[data-action=logout]')
            .addEventListener('click', this.logoutHandler);
        this.parent
            .querySelector('.profile-navigation__security')
            .addEventListener('click', this.goSecurityHandler);
        this.parent
            .querySelector('.profile-navigation__user-information')
            .addEventListener('click', this.goProfileHandler);
        this.parent
            .querySelector('.header-menu__logo')
            .addEventListener('click', this.toMainPageHandler);
        this.parent
            .querySelector('button[data-action=update-profile]')
            ?.addEventListener('click', this.changeProfileHandler);
        this.parent
            .querySelector('button[data-action=update-password]')
            ?.addEventListener('click', this.changePasswordHandler);

        emitter.bind('logout', this.close);
    }

    /**
     * Убирает общие обработчики событий
     */
    removeEventListeners() {
        this.parent
            .querySelector('.profile-link[data-action=profile]')
            .removeEventListener('click', this.goProfileHandler);
        this.parent
            .querySelector('.profile-link[data-action=security]')
            .removeEventListener('click', this.goSecurityHandler);
        this.parent
            .querySelector('.profile-link[data-action=boards]')
            .removeEventListener('click', this.toMainPageHandler);
        this.parent
            .querySelector('.profile-link[data-action=logout]')
            .removeEventListener('click', this.logoutHandler);
        this.parent
            .querySelector('.profile-navigation__security')
            .removeEventListener('click', this.goSecurityHandler);
        this.parent
            .querySelector('.profile-navigation__user-information')
            .removeEventListener('click', this.goProfileHandler);
        this.parent
            .querySelector('.header-menu__logo')
            .removeEventListener('click', this.toMainPageHandler);
        this.parent
            .querySelector('button[data-action=update-profile]')
            ?.removeEventListener('click', this.changeProfileHandler);
        this.parent
            .querySelector('button[data-action=update-password]')
            ?.removeEventListener('click', this.changePasswordHandler);

        emitter.unbind('logout', this.close);
    }

    async changeProfileHandler(e) {
        e.preventDefault();
        const user = {
            name: document.querySelector('input[data-name=name]').value,
            surname: document.querySelector('input[data-name=surname]').value,
            description: document.querySelector('textarea[data-name=user-description]').value,
        };
        dispatcher.dispatch(actionUpdateProfile(user));
    }

    async changePasswordHandler(e) {
        e.preventDefault();
        const newPassword = document.querySelector('input[data-name=new-password]').value;
        const oldPassword = document.querySelector('input[data-name=old-password]').value;
        const repeatNewPassword = document.querySelector(
            'input[data-name=repeat-new-password]',
        ).value;

        if (!Validator.validatePassword(newPassword)) {
        } else if (!Validator.validateRepeatPasswords(newPassword, repeatNewPassword)) {
        } else {
            const user = {
                new_password: newPassword,
                old_password: oldPassword,
            };

            dispatcher.dispatch(actionUpdatePassword(user));
        }
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу досок
     * @param {Event} e - Событие
     */
    toMainPageHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/main', false));
    }

    /**
     * Запись в историю части с профилем отправка события на рендер части со сменой пароля
     * @param {Event} e - событие
     */
    async goSecurityHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/security', false));
    }

    /**
     * Запись в историю части со сменой пароля отправка события на рендер части с профилем
     * @param {Event} e - событие
     */
    async goProfileHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/profile', '', false));
    }

    /**
     * Handler события нажатия на ссылку для перехода на log out
     * @param {Event} e - Событие
     */
    logoutHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionLogout());
    }

    /**
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/signin', false));
    }
}
