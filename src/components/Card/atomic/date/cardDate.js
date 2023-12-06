import workspaceStorage from '../../../../storages/workspaceStorage.js';
import Component from '../../../core/basicComponent.js';
import template from './cardDate.hbs';

import './cardDate.scss';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class CardDate extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template(this.#getCardTimeInformation(this.config.id));
    }

    #getCardTimeInformation = (cardId) => {
        const card = workspaceStorage.getCardById(parseInt(cardId, 10));
        const start = card.start ? card.start.split('T')[0] : false;
        const end = card.end ? card.end.split('T')[0] : false;

        return { start, end };
    };
}
