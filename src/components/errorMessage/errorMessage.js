import Component from '../core/basicComponent.js';

/**
 * Ошибка при неправильном логине/пароле и тп
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class ErrorMessage extends Component {
    constructor(parent, config) {
        super(parent, config, 'errorMessage');
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        const errorDiv = document.createElement('div');
        errorDiv.insertAdjacentHTML('beforeend', this.template(this.config));
        this.parent.insertBefore(errorDiv.firstChild, this.parent.firstChild);
    }
}
