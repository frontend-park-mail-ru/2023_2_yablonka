import Component from '../core/basicComponent.js';
import template from  './header.hbs';
/**
 * Хедер
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Header extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + template(input),
            '',
        );
    }
}
