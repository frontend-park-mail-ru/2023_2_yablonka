import Component from '../../core/basicComponent.js';

/**
 * Контейнер для досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class AllBoards extends Component {
    constructor(parent, config) {
        super(parent, config, 'all-boards');
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.template();
    }
}
