import Component from '../../core/componentClass/component.js';

/**
 * Ошибка при неправильном логине/пароле и тп
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export default class ErrorMessage extends Component {
    constructor(parent, config) {
        super(parent, config, 'error-message');
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = this.template();
        this.parent.insertBefore(errorDiv.firstChild, this.parent.firstChild);
    }
}
