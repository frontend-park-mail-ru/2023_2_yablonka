import Component from '../../../core/basicComponent.js';
import template from './checklist.hbs';
import './checklist.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Checklist extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            name: this.config.name,
            ID: this.config.id,
            checklistItems: this.config.checklistItems,
        });
    }
}
