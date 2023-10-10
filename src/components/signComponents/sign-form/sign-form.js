import Component from '../../core/basicComponent.js';

/**
 * Форма для логина/регистрации
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class SignForm extends Component {
    constructor(parent, config) {
        super(parent, config, 'sign-form');
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.template();
    }
}
