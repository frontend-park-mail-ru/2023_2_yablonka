import Component from '../../core/basicComponent.js';
import template from './cardContent.hbs';
import './cardContent.scss';
import CardDate from '../atomic/date/cardDate.js';

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
            date: new CardDate({ id: this.config.id }).render(),
        });
    }
}
