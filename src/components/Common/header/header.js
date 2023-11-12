import Component from '../../core/basicComponent';
import template from './header.hbs';
/**
 * Хедер
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Header extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

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
        this.parent.insertAdjacentHTML(
            'beforeend',
            template(Object.assign(this.config, this.#innerConfig)),
        );
    }
}
