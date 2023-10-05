/**
 * Базовый класс компонентов
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 * @param {string} templateName - Название шаблона компонента(hbs).
 */
export class Component {
    constructor(parent, config, templateName) {
        this.parent = parent;
        this.config = config;
        this.template = Handlebars.templates[`${templateName}.hbs`];
    }

    /**
     * Возвращает массив данных для шаблона компонента.
     * @returns {Array} - Массив объектов с данными для шаблона компонента.
     */

    get data() {
        return Object.entries(this.config).map(([key, configs]) => ({
            key,
            ...configs,
        }));
    }
}
