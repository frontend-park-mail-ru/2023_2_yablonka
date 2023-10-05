import { Component } from "../../core/componentClass/component.js";

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export class Main extends Component {
    constructor(parent, config) {
        super(parent, config, "main");
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.template();
    }
}
