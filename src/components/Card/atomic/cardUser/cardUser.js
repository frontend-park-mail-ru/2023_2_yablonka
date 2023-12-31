import Component from '../../../core/basicComponent.js';
import template from './cardUser.hbs';
import './cardUser.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class CardUser extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            avatar: this.config.avatar,
            ID: this.config.id,
        });
    }
}
