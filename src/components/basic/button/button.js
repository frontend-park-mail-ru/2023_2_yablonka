import Component from '../../core/basicComponent.js';
import './button.hbs';

/**
 * Компонент кнопки для входа/регистрации
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Button extends Component {
    constructor(parent, config) {
        super(parent, config, 'button');
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', this.template(this.config));
    }
}
