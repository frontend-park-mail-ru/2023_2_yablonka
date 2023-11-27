import Component from '../../../core/basicComponent.js';
import template from './comments.hbs';
import './comments.scss';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Comments extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            avatar: this.config.avatar,
            email: this.config.email,
            comment: this.config.comment,
        });
    }
}
