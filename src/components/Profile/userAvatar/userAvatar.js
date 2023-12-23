import Component from '../../core/basicComponent';
import template from './userAvatar.hbs';
import './userAvatar.scss';

/**
 * слои-обертки
 * @class
 */
export default class UserAvatar extends Component {
    /**
     * Рендерит компонент
     */
    render() {
        return template({
            avatar: this.config.avatar,
            name: this.config.name,
            surname: this.config.surname,
            email: this.config.email,
        });
    }
}
