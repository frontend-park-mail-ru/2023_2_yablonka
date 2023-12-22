import Component from '../../../../core/basicComponent.js';
import template from './historyItem.hbs';
import './historyItem.scss';

/**
 * Компонент сообщения в истории действий на доске
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class HistoryItem extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            avatar: this.config.avatar_url,
            email: this.config.email,
            message: this.config.message,
            creationDate: this.#processDateToLocalTime(this.config.creationDate),
        });
    }

    #processDateToLocalTime = (creationDate) => {
        const date = new Date(creationDate);
        return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} в ${date.getHours()}:${date.getMinutes()}`;
    };
}
