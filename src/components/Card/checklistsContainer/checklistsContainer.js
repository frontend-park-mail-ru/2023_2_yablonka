import Component from '../../core/basicComponent.js';
import template from './checklistsContainer.hbs';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class ChecklistsContainer extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({});
    }
}
