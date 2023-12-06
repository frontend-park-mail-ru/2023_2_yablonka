/**
 * Базовый класс компонентов
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 * @param {string} templateName - Название шаблона компонента(hbs).
 */
export default class Component {
    constructor(parent, config) {
        this.parent = parent;
        this.config = config;
    }
}
