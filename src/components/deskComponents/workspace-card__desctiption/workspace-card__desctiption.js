import Component from '../../core/basicComponent.js';
import './workspace-card__desctiption.hbs';
/**
 * Показывает чьё рабочее пространство
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class WorkspaceCardDesctiption extends Component {
    constructor(parent, config) {
        super(parent, config, 'workspace-card__desctiption');
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            '',
        );
    }
}
