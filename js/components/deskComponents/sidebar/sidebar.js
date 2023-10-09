import Component from '../../core/componentClass/component.js';

/**
 * Меню слева
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export default class Sidebar extends Component {
    constructor(parent, config) {
        super(parent, config, 'sidebar');
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.template();
    }
}
