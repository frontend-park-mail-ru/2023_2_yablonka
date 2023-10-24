import Component from '../../core/basicComponent.js';
/**
 * Список досок по всем пользователям
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class ContentBoardsList extends Component {
    constructor(parent, config) {
        super(parent, config, 'content__boards-list');
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.template();
    }
}
