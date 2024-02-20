import {
    actionNavigate,
    actionRedirect,
    actionUpdatePassword,
    actionUpdateProfile,
} from '../../actions/userActions.js';
import Header from '../../components/Common/header/header.js';
import NotificationMessage from '../../components/Common/notification/notificationMessage.js';
import Component from '../../components/core/basicComponent.js';
import popupEvent from '../../components/core/popeventProcessing.js';
import UserAvatar from '../../components/Profile/userAvatar/userAvatar.js';
import UserInformation from '../../components/Profile/userInformation/userInformation.js';
import UserSecurity from '../../components/Profile/userSecurity/userSecurity.js';
import emitter from '../../modules/actionTrigger.js';
import dispatcher from '../../modules/dispatcher.js';
import Validator from '../../modules/validator.js';
import template from './profile.hbs';
import './profile.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Profile extends Component {
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
            .querySelector('.profile-navigation__security')
            .addEventListener('click', this.goSecurityHandler);
        this.parent
            .querySelector('.profile-navigation__user-information')
            .addEventListener('click', this.goProfileHandler);
        this.parent
            .querySelector('button[data-action=update-profile]')
            ?.addEventListener('click', this.#changeProfileHandler);
        this.parent
            .querySelector('button[data-action=update-password]')
            ?.addEventListener('click', this.#changePasswordHandler);
        this.parent.addEventListener('click', popupEvent.closeAllPopups);

        emitter.bind('logout', this.close);
    }

    /**
     * Убирает общие обработчики событий
     */
    removeEventListeners() {
        this.parent
            .querySelector('.profile-navigation__security')
            .removeEventListener('click', this.goSecurityHandler);
        this.parent
            .querySelector('.profile-navigation__user-information')
            .removeEventListener('click', this.goProfileHandler);
        this.parent
            .querySelector('button[data-action=update-profile]')
            ?.removeEventListener('click', this.changeProfileHandler);
        this.parent
            .querySelector('button[data-action=update-password]')
            ?.removeEventListener('click', this.changePasswordHandler);
        this.parent.removeEventListener('click', popupEvent.closeAllPopups);

        emitter.unbind('logout', this.close);
    }

    /**
     * Функция для обработки события изменения данных профиля
     * @param {Event} e - Событие
     */
    #changeProfileHandler = async (e) => {
        e.preventDefault();
        const name = this.parent.querySelector('input[data-name=name]').value;
        const surname = this.parent.querySelector('input[data-name=surname]').value;

        if (!Validator.validateObjectName(name)) {
            NotificationMessage.showNotification(
                this.parent.querySelector('input[data-name=name]').parentNode,
                false,
                true,
                {
                    fontSize: 14,
                    fontWeight: 200,
                    text: `Имя может содержать лишь буквы латиницы и кириллицы, цифры, спецсимволы $@!?#^:;%'"\\*_ и быть не пустым`,
                },
            );
        } else if (!Validator.validateObjectName(surname)) {
            NotificationMessage.showNotification(
                this.parent.querySelector('input[data-name=surname]').parentNode,
                false,
                true,
                {
                    fontSize: 14,
                    fontWeight: 200,
                    text: `Фамилия должна содержать лишь буквы латиницы и кириллицы, цифры, спецсимволы $@!?#^:;%'"\\*_ и быть не пустой`,
                },
            );
        } else if (name.length > 32 || surname.length > 32) {
            NotificationMessage.showNotification(
                this.parent.querySelector('input[data-name=name]').parentNode,
                false,
                true,
                {
                    fontSize: 14,
                    fontWeight: 200,
                    text: 'Имя и фамилия должны быть не длиннее 32 символов',
                },
            );
        } else {
            const user = {
                name,
                surname,
                description: this.parent.querySelector('textarea[data-name=user-description]')
                    .value,
            };
            dispatcher.dispatch(actionUpdateProfile(user));
        }
    };

    /**
     * Функция для обработки события изменения пароля пользователя
     * @param {Event} e - Событие
     */
    #changePasswordHandler = async (e) => {
        e.preventDefault();

        const newPassword = this.parent.querySelector('input[data-name=new-password]').value;
        const oldPassword = this.parent.querySelector('input[data-name=old-password]').value;
        const repeatNewPassword = this.parent.querySelector(
            'input[data-name=repeat-new-password]',
        ).value;

        if (!Validator.validatePassword(newPassword)) {
            NotificationMessage.showNotification(
                this.parent.querySelector('input[data-name=new-password]').parentNode,
                false,
                true,
                {
                    fontSize: 14,
                    fontWeight: 200,
                    text: 'Пароль должен содержать лишь латинские буквы, цифры, спецсимволы и быть длиннее 8 символов',
                },
            );
        } else if (!Validator.validateRepeatPasswords(newPassword, repeatNewPassword)) {
            NotificationMessage.showNotification(
                this.parent.querySelector('input[data-name=repeat-new-password]').parentNode,
                false,
                true,
                {
                    fontSize: 14,
                    fontWeight: 200,
                    text: 'Новые пароли не совпадают',
                },
            );
        } else {
            const user = {
                new_password: newPassword,
                old_password: oldPassword,
            };

            dispatcher.dispatch(actionUpdatePassword(user));
        }
    };

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

    static changeAvatar = (avatarUrl) => {
        document.querySelector('.profile-user-image').src = `/${avatarUrl}`;
        document.querySelector('.btn-avatar__image').src = `/${avatarUrl}`;
        document.querySelector('.pop-up-menu__avatar-image').src = `/${avatarUrl}`;
    };

    /**
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/signin', false));
    }
}
