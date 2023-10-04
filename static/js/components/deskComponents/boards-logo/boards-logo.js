import { Component } from "../../core/componentClass/component.js";

/**
 * Все доски одного гостевого пространства
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export class BoardsLogo extends Component {
    constructor(parent, config) {
        super(parent, config, "boards-logo");
    }

    /**
     * Рендерит компонент в DOM
     */
    
    render() {
        this.parent.innerHTML += this.template();
    }
}
