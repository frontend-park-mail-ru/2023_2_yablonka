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
import UploadAvatarModal from '../components/uploadAvatarModal/uploadAvatarModal.js';
import navPopupAction from '../components/navPopup/navPopupHelper.js';
import popoventProcess from '../components/core/popeventProcessing.js';
import changeAvatarPopupAction from '../components/changeAvatarPopup/changeAvatarPopupHelper.js';
import {
    uploadAvatarModalAction,
    chooseFileAvatarModalAction,
    previewAvatarModalAction,
    revertChangeAvatarModalAction,
} from '../components/uploadAvatarModal/uploadAvatarModalHelper.js';

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
            dialogID: 'upload-avatar',
        });
        changeAvatarPopup.render();

        const uploadAvatarModal = new UploadAvatarModal(this.#root, {});
        uploadAvatarModal.render();

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

    /**
     * Запись в историю части с профилем отправка события на рендер части со сменой пароля
     * @param {Event} e - событие
     */
    goSecurityHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.href, '', true));
        dispatcher.dispatch(actionNavigate(`${window.location.origin}/security`, '', false));
        emitter.trigger('security');
    }

    /**
     * Запись в историю части со сменой пароля отправка события на рендер части с профилем
     * @param {Event} e - событие
     */
    goProfileHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.href, '', true));
        dispatcher.dispatch(actionNavigate(`${window.location.origin}/profile`, '', false));
        emitter.trigger('profile');
    }

    /**
     *Рендерит части со сменой пароля
     */
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
        this.#root.querySelector('.avatar__button').addEventListener('click', navPopupAction);
        this.#root
            .querySelector('.change-avatar__button')
            .addEventListener('click', changeAvatarPopupAction);
        this.#root
            .querySelector('.button-profile[data-action=open-upload-avatar-modal]')
            .addEventListener('click', uploadAvatarModalAction);
        this.#root
            .querySelector('.button-upload-avatar')
            .addEventListener('click', chooseFileAvatarModalAction);
        this.#root
            .querySelector('.input-upload-avatar')
            .addEventListener('change', previewAvatarModalAction);
        this.#root
            .querySelector('.button-revert-change-avatar')
            .addEventListener('click', revertChangeAvatarModalAction);
        this.#root
            .querySelector('.upload-avatar-modal__button_cancel')
            .addEventListener('click', revertChangeAvatarModalAction);

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
    }

    /**
     * Убирает общие обработчики событий
     */
    removeListeners() {
        this.#root.querySelector('.avatar__button').removeEventListener('click', navPopupAction);
        this.#root
            .querySelector('.change-avatar__button')
            .removeEventListener('click', changeAvatarPopupAction);
        this.#root
            .querySelector('.button-profile[data-action=open-upload-avatar-modal]')
            .removeEventListener('click', uploadAvatarModalAction);
        this.#root
            .querySelector('.button-upload-avatar')
            .removeEventListener('click', chooseFileAvatarModalAction);
        this.#root
            .querySelector('.input-upload-avatar')
            .removeEventListener('change', previewAvatarModalAction);
        this.#root
            .querySelector('.button-revert-change-avatar')
            .removeEventListener('click', revertChangeAvatarModalAction);
        this.#root
            .querySelector('.upload-avatar-modal__button_cancel')
            .removeEventListener('click', revertChangeAvatarModalAction);

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

    /**
     * Handler события нажатия на ссылку для перехода на страницу досок
     * @param {Event} e - Событие
     */
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
