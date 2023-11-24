import workspaceStorage from '../../../../storages/workspaceStorage';
import Component from '../../../core/basicComponent';
import Card from '../atomic/card/card';
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
        const listCards = [];
        lists.forEach((list) => {
            listCards.push(
                new List(null, {
                    name: this.config.name,
                    ID: this.config.id,
                    cards: this.#getList(workspaceStorage.getListCards(list.id)),
                }).render(),
            );
        });
        return listCards;
    }

    #getList(cards) {
        const boardList = [];
        cards.forEach((card) => {
            boardList.push(new Card(null, card).render());
        });
        return boardList;
    }
}
