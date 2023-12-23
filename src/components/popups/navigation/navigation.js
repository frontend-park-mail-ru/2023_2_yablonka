import { actionLogout, actionNavigate, actionRedirect } from '../../../actions/userActions.js';
import dispatcher from '../../../modules/dispatcher.js';
import Component from '../../core/basicComponent.js';
import popupEvent from '../../core/popeventProcessing.js';
import template from './navigation.hbs';
import './navigation.scss';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Navigation extends Component {
    #innerConfig = {
        buttons: [
            {
                action: 'boards',
                title: 'Доски',
                href: '/main',
            },
            {
                action: 'profile',
                title: 'Профиль',
                href: '/profile',
            },
            {
                action: 'security',
                title: 'Безопасность',
                href: '/security',
            },
        ],
    };

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...{
                    avatar: this.config.avatar_url,
                    name: this.config.name,
                    surname: this.config.surname,
                    email: this.config.email,
                },
                ...this.#innerConfig,
            }),
        );
    }

    addEventListeners() {
        this.parent
            .querySelector('.btn-avatar')
            .addEventListener('click', this.#navigationPopupAction);
        this.parent.querySelector('.logo-wrapper').addEventListener('click', this.#toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=boards]')
            .addEventListener('click', this.#toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=logout]')
            .addEventListener('click', this.#logoutHandler);
        this.parent
            .querySelector('.profile-link[data-action=profile]')
            .addEventListener('click', this.#toProfileHandler);
        this.parent
            .querySelector('.profile-link[data-action=security]')
            .addEventListener('click', this.#toSecurityHandler);
    }

    removeEventListeners() {
        this.parent
            .querySelector('.btn-avatar')
            .removeEventListener('click', this.#navigationPopupAction);
        this.parent
            .querySelector('.logo-wrapper')
            .removeEventListener('click', this.#toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=boards]')
            .removeEventListener('click', this.#toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=logout]')
            .removeEventListener('click', this.#logoutHandler);
        this.parent
            .querySelector('.profile-link[data-action=profile]')
            .removeEventListener('click', this.#toProfileHandler);
        this.parent
            .querySelector('.profile-link[data-action=security]')
            .removeEventListener('click', this.#toSecurityHandler);
    }

    #navigationPopupAction = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#navigation-menu');

        if (dialog.getAttribute('open') === null) {
            popupEvent.closeAllPopups();
            popupEvent.addPopup(dialog);
            dialog.show();
        } else {
            popupEvent.deletePopup(dialog);
            dialog.close();
        }
    };

    /**
     * Handler события нажатия на ссылку для перехода на log out
     * @param {Event} e - Событие
     */
    #logoutHandler = (e) => {
        e.preventDefault();
        dispatcher.dispatch(actionLogout());
    };

    /**
     * Handler события нажатия на ссылку для перехода на страницу досок
     * @param {Event} e - Событие
     */
    #toBoardsHandler = (e) => {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/main', false));
    };

    /**
     * Handler события нажатия на ссылку для перехода на страницу смены пароля
     * @param {Event} e - Событие
     */
    #toSecurityHandler = (e) => {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/security', false));
    };

    /**
     * Handler события нажатия на ссылку для перехода на страницу профиля
     * @param {Event} e - Событие
     */
    #toProfileHandler = (e) => {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/profile', false));
    };
}
