import Component from '../../core/basicComponent.js';
import template from './formInput.hbs';

/**
 * Контейнер для досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class FormInput extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    get className() {
        const { className } = this.config;
        return `.form__input-${className}`;
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }
}
