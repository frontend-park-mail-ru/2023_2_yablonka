import Component from '../../core/basicComponent.js';
import template from  './content__boards-list.hbs';
/**
 * Список досок по всем пользователям
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class ContentBoardsList extends Component {
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
