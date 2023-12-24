import workspaceStorage from '../../../../storages/workspaceStorage';
import Component from '../../../core/basicComponent';
import AddNewList from '../atomic/addNewList/addNewList';
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
            addNewList: new AddNewList(null, {}).render(),
        });
    }

    #getLists(lists) {
        const boardLists = [];
        lists.forEach((list) => {
            boardLists.push(
                new List(null, {
                    name: list.name,
                    id: list.id,
                    list_position: list.list_position,
                    cards: workspaceStorage.getListCards(list.id),
                }).render(),
            );
        });
        return boardLists;
    }
}
