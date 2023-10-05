import { Component } from "../../core/componentClass/component.js";

/**
 * Абстрактный слой для размещения формы и того, что рядом с ней
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export class SignLocation extends Component {
    constructor(parent, config) {
        super(parent, config, "sign-location");
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.template();
    }
}
