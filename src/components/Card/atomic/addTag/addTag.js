import Component from '../../../core/basicComponent.js';
import template from './addTag.hbs';
import './addTag.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class AddTag extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({});
    }
}
