import workspaceStorage from '../../../../../storages/workspaceStorage';
import Component from '../../../../core/basicComponent';
import CardTag from '../cardTag/cardTag';
import TagsContainer from '../tagsContainer/tagsContainer';
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
            tags: workspaceStorage.getCardTags(parseInt(this.config.id, 10)).length
                ? new TagsContainer(null, { id: this.config.id }).render()
                : null,
        });
    }
}
