import Component from '../../core/basicComponent';
import template from './header.hbs';
import './header.scss';

/**
 * Хедер
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Header extends Component {
    #innerConfig = {
        menuParagraphs: [],
    };

    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            avatar: this.config.avatar ? this.config.avatar : 'avatar.jpg',
            ...this.#innerConfig,
            isBoard: this.config.isBoard,
        });
    }
}
