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
        menuParagraphs: [
            {
                title: 'Проекты',
            },
            {
                title: 'Избранное',
            },
            {
                title: 'Шаблоны',
            },
        ],
    };

    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template(Object.assign(this.config.avatar, this.#innerConfig));
    }
}
