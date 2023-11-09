import Component from '../../core/basicComponent.js';
import template from  './button__create-workspace.hbs';
/**
 * Кнопка создания рабочего пространства
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class ButtonCreateWorkspace extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += template();
    }
}
