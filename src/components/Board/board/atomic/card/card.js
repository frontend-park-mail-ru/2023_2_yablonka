import workspaceStorage from '../../../../../storages/workspaceStorage';
import Component from '../../../../core/basicComponent';
import template from './card.hbs';
import './card.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Card extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            name: this.config.name,
            ID: this.config.id,
            tags: this.#getCardTags(this.config.id),
        });
    }

    #getCardTags = (cardId) => {
        const cardTags = [];

        const tags = workspaceStorage.getCardTags(parseInt(cardId, 10));

        tags.forEach((tag) => {
            cardTags.push(tag.name);
        });

        return cardTags;
    };
}
