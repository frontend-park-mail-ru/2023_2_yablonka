import Component from '../../../core/basicComponent';
import BoardUser from '../atomic/boardUser/boardUser';
import template from './boardMenu.hbs';
import './boardMenu.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class BoardMenu extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            name: this.config.name,
            users: this.#getBoardUsers(this.config.users),
            usersOverflow: {
                overflow: this.config.users.lenght > 4,
                count: this.config.users.lenght - 4,
            },
        });
    }

    #getBoardUsers(users) {
        const boardUsers = [];
        users.forEach((user) => {
            boardUsers.push(new BoardUser(null, user).render());
        });
        return boardUsers;
    }
}
