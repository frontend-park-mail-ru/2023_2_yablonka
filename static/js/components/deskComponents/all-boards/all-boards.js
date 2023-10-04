import { Component } from "../../core/componentClass/component.js";

/**
 * Контейнер для досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export class AllBoards extends Component {
    constructor(parent, config) {
        super(parent, config, "all-boards");
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.template();
    }
}
