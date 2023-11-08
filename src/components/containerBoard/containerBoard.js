import Component from '../core/basicComponent.js';
import './containerBoard.hbs';

/**
 * Контейнер для доски
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class ContainerBoard extends Component {
    constructor(parent, config) {
        super(parent, config, 'containerBoard');
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', this.template(this.config));
    }
}
