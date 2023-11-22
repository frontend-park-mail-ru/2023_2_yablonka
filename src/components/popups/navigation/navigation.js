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
        document
            .querySelector('.btn-avatar')
            .addEventListener('click', this.#navigationPopupAction);
    }

    removeEventListeners() {
        document
            .querySelector('.btn-avatar')
            .removeEventListener('click', this.#navigationPopupAction);
    }

    #navigationPopupAction = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = document.querySelector('#navigation-menu');

        if (dialog.getAttribute('open') !== null) {
            popupEvent.deletePopup(dialog);
            dialog.close();
        } else {
            popupEvent.addPopup(dialog);
            dialog.show();
            popupEvent.closeOtherPopups(dialog);
        }
    };
}
