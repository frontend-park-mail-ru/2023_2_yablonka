import Component from '../../../../core/basicComponent';
import Card from '../card/card';
import template from './list.hbs';
import './list.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class List extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            name: this.config.name,
            ID: this.config.id,
            position: this.config.position,
            cards: this.#getListCards(this.config.cards),
        });
    }

    #getListCards(cards) {
        const listCards = [];
        cards.forEach((card) => {
            listCards.push(new Card(null, { id: card.id, name: card.name }).render());
        });
        return listCards;
    }
}
