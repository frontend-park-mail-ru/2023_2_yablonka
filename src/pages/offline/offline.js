import Component from '../../components/core/basicComponent.js';
import template from './offline.hbs';

/**
 * Страница offline
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Offline extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML(
            'beforeend',
            template({ redirectionPage: this.config.redirectionPage }),
        );
    }

    /**
     * Добавление подписок(которых нет)
     */
    addEventListeners(){}

    /**
     * Удаление подписок(которых нет)
     */
    removeEventListeners(){}
}
