import Component from '../../../core/basicComponent.js';
import template from './boardUser.hbs';
import './boardUser.scss';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class BoardUser extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            ID: this.config.id,
            avatar: this.config.avatar,
            email: this.config.email,
            inCard: this.config.inCard,
        });
    }
}
