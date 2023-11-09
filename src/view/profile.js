import PageLayout from '../components/pageLayout/pageLayout.js';
import Header from '../components/header/header.js';
import ContainerProfile from '../components/containerProfile/containerProfile.js';
import Form from '../components/basic/form/form.js';
import FormInput from '../components/basic/formInput/formInput.js';
import TextArea from '../components/basic/textArea/textArea.js';
import Button from '../components/basic/button/button.js';
import NavigationPopup from '../components/popups/navigationPopup/navigationPopup.js';
import ChangeAvatarPopup from '../components/popups/changeAvatarPopup/changeAvatarPopup.js';
import {
    actionRedirect,
    actionLogout,
    actionNavigate,
    actionUpdateProfile,
    actionUpdatePassword,
} from '../actions/userActions.js';
import userStorage from '../storages/userStorage.js';
import emitter from '../modules/actionTrigger.js';
import dispatcher from '../modules/dispatcher.js';
import UploadAvatarModal from '../components/popups/uploadAvatar/uploadAvatar.js';
import navigationPopupAction from '../components/popups/navigationPopup/navigationPopupHelper.js';
import popoventProcess from '../components/core/popeventProcessing.js';
import changeAvatarPopupAction from '../components/popups/changeAvatarPopup/changeAvatarPopupHelper.js';
import Validator from '../modules/validator.js';
import ErrorMessage from '../components/errorMessage/errorMessage.js';
import errorMessageAnimation from '../components/core/errorMessageAnimation.js';

/**
 * Класс для рендера страницы профиля
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
class Profile {
    #root;

    #config = {
        formInput: {
            name: {
                withImage: false,
                type: 'text',
                placeholder: 'Имя',
                dataName: 'name',
                className: 'profile',
                disable: false,
            },
            surname: {
                withImage: false,
                type: 'text',
                placeholder: 'Фамилия',
                dataName: 'surname',
                className: 'profile',
                disable: false,
            },
            email: {
                withImage: false,
                type: 'email',
                placeholder: 'Email',
                dataName: 'email',
                className: 'profile',
                disable: true,
            },
        },
        formInputSecurity: {
            oldPassword: {
                withImage: false,
                type: 'password',
                placeholder: 'Старый пароль',
                dataName: 'old-password',
                className: 'profile',
                disable: false,
            },
            newPassword: {
                withImage: false,
                type: 'password',
                placeholder: 'Новый пароль',
                dataName: 'new-password',
                className: 'profile',
                disable: false,
            },
            surname: {
                withImage: false,
                type: 'password',
                placeholder: 'Повторите новый пароль',
                dataName: 'repeat-new-password',
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

        const navigationPopup = new NavigationPopup(this.#root, {
            email: user.body.user.email,
            avatar: user.body.user.thumbnail_url,
            name: namesurname,
        });
        navigationPopup.render();

        const changeAvatarPopup = new ChangeAvatarPopup(this.#root, {
            dialogID: 'upload-avatar',
        });
        changeAvatarPopup.render();

        const uploadAvatarModalWindow = new UploadAvatarModal(this.#root, {});
        uploadAvatarModalWindow.render();

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

    /**
     * Рендер части с профилем
     */

    async renderProfile() {
        document
            .querySelector('button[data-action=update-password]')
            ?.removeEventListener('click', this.changePasswordHandler);
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
                dataName: input[1].dataName,
                withImage: input[1].withImage,
                disable: input[1].disable,
                text: userStorage.storage.get(userStorage.userModel.body).body.user[
                    input[1].dataName
                ],
            });
            formInput.render();
        });

        const errorMessage = new ErrorMessage(this.#root.querySelector(form.className).firstChild, {
            className: 'sign',
            errorName: 'password-or-user-information',
            success: false,
        });
        errorMessage.render();

        const textArea = new TextArea(this.#root.querySelector(form.className), {
            className: 'profile',
            maxLength: 1024,
            rows: 50,
            columns: 100,
            dataName: 'description',
            placeholder: 'О себе...',
        });
        textArea.render();

        const buttonChangeData = new Button(userInfoContainer, {
            className: 'profile-save',
            type: 'submit',
            formId: 'form-profile',
            action: 'update-profile',
            id: 'save-profile-button',
            text: 'Сохранить',
        });
        buttonChangeData.render();

        this.#root
            .querySelector('.profile-navigation__user-information')
            .classList.add('profile-navigation_active');

        this.#root
            .querySelector('button[data-action=update-profile]')
            .addEventListener('click', this.changeProfileHandler);
    }

    /**
     * Запись в историю части с профилем отправка события на рендер части со сменой пароля
     * @param {Event} e - событие
     */
    async goSecurityHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionNavigate('/security', '', false));
        emitter.trigger('security');
    }

    /**
     * Запись в историю части со сменой пароля отправка события на рендер части с профилем
     * @param {Event} e - событие
     */
    async goProfileHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionNavigate('/profile', '', false));
        emitter.trigger('profile');
    }

    /**
     *Рендерит части со сменой пароля
     */
    async renderSecurity() {
        document
            .querySelector('button[data-action=update-profile]')
            ?.removeEventListener('click', this.changeProfileHandler);
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
                dataName: input[1].dataName,
                withImage: input[1].withImage,
                disable: input[1].disable,
            });
            formInput.render();
        });

        const errorMessage = new ErrorMessage(this.#root.querySelector(form.className).firstChild, {
            className: 'sign',
            errorName: 'password-or-user-information',
            success: false,
        });
        errorMessage.render();

        const buttonChangeData = new Button(userInfoContainer, {
            className: 'profile-save',
            type: 'submit',
            formId: 'form-profile',
            action: 'update-password',
            id: 'save-profile-button',
            text: 'Сменить пароль',
        });
        buttonChangeData.render();

        this.#root
            .querySelector('.profile-navigation__security')
            .classList.add('profile-navigation_active');

        document
            .querySelector('button[data-action=update-password]')
            .addEventListener('click', this.changePasswordHandler);
    }

    /**
     * Добавляет общие обработчики событий
     */
    addListeners() {
        this.#root
            .querySelector('.avatar__button')
            .addEventListener('click', navigationPopupAction);
        this.#root
            .querySelector('.change-avatar__button')
            .addEventListener('click', changeAvatarPopupAction);
        UploadAvatarModal.addEventListeners();

        this.#root.addEventListener('click', popoventProcess);

        this.#root
            .querySelector('.profile-link[data-action=profile]')
            .addEventListener('click', this.goProfileHandler);
        this.#root
            .querySelector('.profile-link[data-action=security]')
            .addEventListener('click', this.goSecurityHandler);
        this.#root
            .querySelector('.profile-link[data-action=boards]')
            .addEventListener('click', this.toMainPageHandler);
        this.#root
            .querySelector('.profile-navigation__security')
            .addEventListener('click', this.goSecurityHandler);
        this.#root
            .querySelector('.profile-navigation__user-information')
            .addEventListener('click', this.goProfileHandler);
        this.#root
            .querySelector('.profile-link[data-action=logout]')
            .addEventListener('click', this.logoutHandler);
        this.#root
            .querySelector('.header-menu__logo')
            .addEventListener('click', this.toMainPageHandler);
        emitter.bind('logout', this.close);
        emitter.bind('profile', this.renderProfile.bind(this));
        emitter.bind('security', this.renderSecurity.bind(this));
        emitter.bind('changeError', this.changeError.bind(this));
        emitter.bind('changeSuccess', this.changeSuccess.bind(this));
    }

    /**
     * Убирает общие обработчики событий
     */
    removeListeners() {
        this.#root
            .querySelector('.avatar__button')
            .removeEventListener('click', navigationPopupAction);
        this.#root
            .querySelector('.change-avatar__button')
            .removeEventListener('click', changeAvatarPopupAction);
        UploadAvatarModal.removeEventListeners();

        this.#root.addEventListener('click', popoventProcess);

        this.#root
            .querySelector('.profile-link[data-action=profile]')
            .removeEventListener('click', this.renderProfile);
        this.#root
            .querySelector('.profile-link[data-action=security]')
            .removeEventListener('click', this.renderSecurity);
        this.#root
            .querySelector('.profile-link[data-action=boards]')
            .removeEventListener('click', this.toMainPageHandler);
        this.#root
            .querySelector('.profile-navigation__security')
            .removeEventListener('click', this.goSecurityHandler);
        this.#root
            .querySelector('.profile-navigation__user-information')
            .removeEventListener('click', this.goProfileHandler);
        this.#root
            .querySelector('.profile-link[data-action=logout]')
            .removeEventListener('click', this.logoutHandler);
        this.#root
            .querySelector('.header-menu__logo')
            .removeEventListener('click', this.toMainPageHandler);
        this.#root
            .querySelector('.upload-avatar-modal__button_upload')
            .removeEventListener('click', updateAvatarModal);
        emitter.unbind('logout', this.close);
        emitter.unbind('profile', this.renderProfile);
        emitter.unbind('security', this.renderSecurity);
        emitter.unbind('changeError', this.changeError);
        emitter.unbind('changeSuccess', this.changeSuccess);
    }

    async changeProfileHandler(e) {
        e.preventDefault();
        const user = {
            user_id: userStorage.storage.get(userStorage.userModel.body).body.user.user_id,
            name: document.querySelector('input[data-name=name]').value,
            surname: document.querySelector('input[data-name=surname]').value,
            description: document.querySelector('textarea[data-name=description]').value,
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
            errorMessageAnimation('sign', 'password-or-user-information', 'Неверный пароль');
        } else if (!Validator.validateRepeatPasswords(newPassword, repeatNewPassword)) {
            errorMessageAnimation('sign', 'password-or-user-information', 'Пароли не совпадают');
        } else {
            const user = {
                user_id: userStorage.storage.get(userStorage.userModel.body).body.user.user_id,
                new_password: newPassword,
                old_password: oldPassword,
            };

            dispatcher.dispatch(actionUpdatePassword(user));
        }
    }

    changeError() {
        const errorElement = document.querySelector('#form-profile').firstChild.firstChild;

        errorElement.style.color = '#F46285';
        errorMessageAnimation('sign', 'password-or-user-information', 'Не удалось изменить данные');

        errorElement.style.color = '#F46285';
    }

    changeSuccess() {
        const errorElement = document.querySelector('#form-profile').firstChild.firstChild;

        errorElement.style.color = '#62F470';
        errorMessageAnimation('sign', 'password-or-user-information', 'Данные успешно изменены');

        errorElement.style.color = '#F46285';
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
     * Handler события нажатия на ссылку для перехода на страницу досок
     * @param {Event} e - Событие
     */
    toMainPageHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/boards', false));
    }

    /**
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/signin', false));
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
