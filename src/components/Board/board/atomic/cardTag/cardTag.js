import Component from '../../../../core/basicComponent';
import template from './cardTag.hbs';
import './cardTag.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class CardTag extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            tagName: this.config.tagName,
        });
    }
}
