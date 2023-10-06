import { Component } from "../../core/componentClass/component.js";

/**
 * Меню слева
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export class WorkspaceMessage extends Component {
    constructor(parent, config) {
        super(parent, config, "workspace-message");
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.data.reduce(
            (messages, message) => messages + this.template(message),
            ""
        );
    }
}