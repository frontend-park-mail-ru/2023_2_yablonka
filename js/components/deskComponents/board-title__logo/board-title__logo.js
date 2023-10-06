import { Component } from "../../core/componentClass/component.js";

/**
 * Доска с названием и картинкой
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export class BoardTitleLogo extends Component {
    constructor(parent, config) {
        super(parent, config, "board-title__logo");
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
