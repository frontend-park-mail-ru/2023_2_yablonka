import workspaceStorage from '../../../../../storages/workspaceStorage';
import Component from '../../../../core/basicComponent';
import CardTag from '../cardTag/cardTag';
import template from './tagsContainer.hbs';
import './tagsContainer.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class TagsContainer extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            tags: this.#getCardTags(this.config.id),
        });
    }

    #getCardTags = (cardId) => {
        const cardTags = [];

        if (cardId !== null) {
            const tags = workspaceStorage.getCardTags(parseInt(cardId, 10));

            tags.forEach((tag) => {
                cardTags.push(new CardTag(null, { tagName: tag.name }).render());
            });
        }

        return cardTags;
    };
}
