import Component from '../../core/basicComponent.js';

/**
 * Заголовок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class SignLocationHeaderTitle extends Component {
    constructor(parent, config) {
        super(parent, config, 'sign-location__header-title');
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.data.reduce(
            (titles, title) => titles + this.template(title),
            '',
        );
    }
}
