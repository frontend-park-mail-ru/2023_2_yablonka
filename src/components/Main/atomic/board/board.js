import Component from '../../../core/basicComponent';
import template from './board.hbs';
/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Board extends Component {
    /**
     * Рендерит компонент в DOM
     */

    render() {
        return template(this.config);
    }
}
