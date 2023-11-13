import Component from '../../core/basicComponent.js';
import template from './pageLayoutMain.hbs';
import './pageLayoutMain.scss';
/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class PageLayoutMain extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }
}
