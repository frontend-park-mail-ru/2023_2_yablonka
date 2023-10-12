import Component from '../core/basicComponent.js';

/**
 * Контейнер для досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class FormInput extends Component {
    constructor(parent, config) {
        super(parent, config, 'formInput');
    }

    get className() {
        const { className } = this.config;
        return `.form__input_${className}`;
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', this.template(this.config));
    }
}
