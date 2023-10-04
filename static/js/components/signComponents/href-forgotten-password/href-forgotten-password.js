import { Component } from "../../core/componentClass/component.js";

/**
 * Ссылка на восстановление пароля
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export class HrefForgottenPassword extends Component {
    constructor(parent, config) {
        super(parent, config, "href-forgotten-password");
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
