import Component from '../core/basicComponent.js';
import './boardMenu.hbs';

/**
 * Меню доски
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class BoardMenu extends Component {
    constructor(parent, config) {
        super(parent, config, 'boardMenu');
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', this.template(this.config));
    }
}
