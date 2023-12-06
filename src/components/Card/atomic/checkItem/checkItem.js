import Component from '../../../core/basicComponent.js';
import template from './checkItem.hbs';
import './checkItem.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class CheckItem extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            checkitem_id: this.config.id,
            checklist_id: this.config.checklist_id,
            name: this.config.name,
            checked: this.config.done,
        });
    }
}
