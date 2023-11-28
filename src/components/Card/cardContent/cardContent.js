import workspaceStorage from '../../../storages/workspaceStorage.js';
import Comments from '../atomic/comments/comments.js';
import Component from '../../core/basicComponent.js';
import template from './cardContent.hbs';
import './cardContent.scss';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class CardContent extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            avatar: this.config.avatar,
        });
    }
}
