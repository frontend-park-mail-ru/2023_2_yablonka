import Component from '../../core/basicComponent.js';
import template from  './content__header-name.hbs';
/**
 * Заголовок мои/гостевые рабочие пространства
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class ContentHeaderName extends Component {
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
