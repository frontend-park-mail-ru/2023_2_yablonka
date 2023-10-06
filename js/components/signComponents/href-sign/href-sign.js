import { Component } from "../../core/componentClass/component.js";

/**
 * Компонент перехода на вход/регистрацию
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export class HrefSign extends Component {
    constructor(parent, config) {
        super(parent, config, "href-sign");
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.data.reduce(
            (hrefs, href) => hrefs + this.template(href),
            ""
        );
    }
}