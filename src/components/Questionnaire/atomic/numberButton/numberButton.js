import Component from '../../../core/basicComponent';
import template from './numberButton.hbs';
/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class NumberButton extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({ rating: this.config });
    }
}
