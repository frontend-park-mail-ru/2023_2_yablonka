import { Component } from "../../core/componentClass/component.js";

/**
 * Компонент кнопки для входа/регистрации
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export class ButtonSign extends Component {
    constructor(parent, config) {
        super(parent, config, "button-sign");
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.innerHTML += this.data.reduce(
            (buttons, button) => buttons + this.template(button),
            ""
        );
    }
}
