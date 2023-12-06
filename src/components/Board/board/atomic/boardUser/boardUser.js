import Component from '../../../../core/basicComponent';
import template from './boardUser.hbs';
import './boardUser.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class BoardUser extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            avatar_url: this.config.avatar_url,
            ID: this.config.user_id,
        });
    }
}
