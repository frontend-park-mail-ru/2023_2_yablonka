import Component from '../../../core/basicComponent.js';
import template from './filesContainer.hbs';
import './filesContainer.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class FilesContainer extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({});
    }
}
