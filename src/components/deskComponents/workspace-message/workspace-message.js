import Component from '../../core/basicComponent.js';
import './workspace-message.hbs';
/**
 * Меню слева
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class WorkspaceMessage extends Component {
    constructor(parent, config) {
        super(parent, config, 'workspace-message');
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.data.reduce(
            (messages, message) => messages + this.template(message),
            '',
        );
    }
}
