import Component from '../../core/basicComponent.js';
import template from './link.hbs';

/**
 * Контейнер для досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Link extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template(this.config);
    }
}
