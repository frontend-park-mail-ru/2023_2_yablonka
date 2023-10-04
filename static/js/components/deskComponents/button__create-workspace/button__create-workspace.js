import { Component } from "../../core/componentClass/component.js";

/**
 * Кнопка создания рабочего пространства
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export class ButtonCreateWorkspace extends Component {
    constructor(parent, config) {
        super(parent, config, "button__create-workspace");
    }

    /**
     * Рендерит компонент в DOM
     */
    
    render() {
        this.parent.innerHTML += this.template();
    }
}
