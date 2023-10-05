import { Component } from "../../core/componentClass/component.js";

/**
 * Заголовок с лого
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export class SignLocationHeader extends Component {
    constructor(parent, config) {
        super(parent, config, "sign-location__header");
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.data.reduce(
            (logos, logo) => logos + this.template(logo),
            ""
        );
    }
}
