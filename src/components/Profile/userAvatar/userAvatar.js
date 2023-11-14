import Component from '../../core/basicComponent';
import template from './userAvatar.hbs';
/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class UserAvatar extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            avatar: this.config.avatar,
            name: this.config.name,
            surname: this.config.surname,
        });
    }
}
