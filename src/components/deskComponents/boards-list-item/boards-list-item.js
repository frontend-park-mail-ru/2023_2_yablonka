import Component from '../../core/basicComponent.js';
import template from  './boards-list-item.hbs';
/**
 * Элемент списка досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class BoardsListItem extends Component {
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
