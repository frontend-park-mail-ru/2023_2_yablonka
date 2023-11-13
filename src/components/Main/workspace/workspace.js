import Component from '../../core/basicComponent.js';
import template from './workspace.hbs';
import './workspace.scss';
/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Workspace extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        return template(this.config);
    }
}
