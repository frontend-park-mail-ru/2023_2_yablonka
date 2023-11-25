import workspaceStorage from '../../../../storages/workspaceStorage';
import Component from '../../../core/basicComponent';
import List from '../atomic/list/list';
import template from './boardContent.hbs';
import './boardContent.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class BoardContent extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            lists: this.#getLists(this.config.lists),
        });
    }

    #getLists(lists) {
        const boardLists = [];
        lists.forEach((list) => {
            boardLists.push(
                new List(null, {
                    name: this.config.name,
                    id: this.config.id,
                    cards: workspaceStorage.getListCards(list.id),
                }).render(),
            );
        });
        return boardLists;
    }
}