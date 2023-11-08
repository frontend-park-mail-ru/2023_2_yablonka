import Component from '../core/basicComponent.js';
import './pageLayout.hbs';

/**
 * Контейнер для досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class PageLayout extends Component {
    constructor(parent, config) {
        super(parent, config, 'pageLayout');
    }

    get className() {
        const { className } = this.config;
        return `.page__layout-${className}`;
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', this.template(this.config));
    }
}
