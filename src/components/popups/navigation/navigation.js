import Component from '../../core/basicComponent.js';
import template from './navigation.hbs';
/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Navigation extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    #innerConfig = {
        buttons: [
            {
                action: 'boards',
                title: 'Доски',
                href: '/boards',
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
            template(Object.assign(this.config, this.#innerConfig)),
        );
    }

    static addEventListeners() {
        document
            .querySelector('.btn-avatar')
            .addEventListener('click', this.#navigationPopupAction);
    }

    static removeEventListeners() {
        document
            .querySelector('.btn-avatar')
            .removeEventListener('click', this.#navigationPopupAction);
    }

    static #navigationPopupAction = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = document.querySelector('#navigation-menu');

        if (dialog.getAttribute('open') === '') {
            dialog.close();
        } else {
            dialog.show();
        }
    };
}
