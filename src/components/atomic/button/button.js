import Component from '../../core/basicComponent.js';
import template from './button.hbs';

/**
 * Компонент кнопки для входа/регистрации
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Button extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template(this.config);
    }
}
