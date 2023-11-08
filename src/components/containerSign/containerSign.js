import Component from '../core/basicComponent.js';
import template from './containerSign.hbs';

/**
 * Контейнер для досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class ContainerSign extends Component {
    constructor(parent, config) {
        super(parent, config,);
    }

    static get lastWrapperClassName() {
        return '.authentication';
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }
}
