import Component from '../../core/basicComponent.js';

/**
 * Контейнер для формы входа/регистрации
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class SignFormContainer extends Component {
    constructor(parent, config) {
        super(parent, config, 'sign-form__container');
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            '',
        );
    }
}
