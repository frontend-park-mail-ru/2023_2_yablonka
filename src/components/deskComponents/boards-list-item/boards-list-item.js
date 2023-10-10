import Component from '../../core/basicComponent.js';
/**
 * Элемент списка досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class BoardsListItem extends Component {
    constructor(parent, config) {
        super(parent, config, 'boards-list-item');
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.template();
    }
}
