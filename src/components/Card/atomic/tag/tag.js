import Component from '../../../core/basicComponent.js';
import template from './tag.hbs';
import './tag.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Tag extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            tagName: this.config.tagName,
        });
    }
}
