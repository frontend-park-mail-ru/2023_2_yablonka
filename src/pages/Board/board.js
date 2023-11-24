import { actionLogout, actionNavigate, actionRedirect } from '../../actions/userActions.js';
import BoardContent from '../../components/Board/board/boardContent/boardContent.js';
import Header from '../../components/Common/header/header.js';
import Sidebar from '../../components/Board/sidebar/sidebar.js';
import Component from '../../components/core/basicComponent.js';
import emitter from '../../modules/actionTrigger.js';
import dispatcher from '../../modules/dispatcher.js';
import workspaceStorage from '../../storages/workspaceStorage.js';
import BoardMenu from '../../components/Board/board/boardMenu/boardMenu.js';
import template from './board.hbs';
import './board.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class BoardPage extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        const page = {
            thumbnail_url: this.config.board.thumbnail_url,
            header: new Header(null, { avatar: this.config.user.avatar_url }).render(),
            sidebar: new Sidebar(null, {
                workspaceName: workspaceStorage.getWorkspaceById(this.config.board.workspace_id)
                    .workspace_name,
                workspace_id: this.config.board.workspace_id,
            }).render(),
            boardMenu: new BoardMenu(null, {
                name: this.config.board.name,
                users: workspaceStorage.getBoardUsers(this.config.board.board_id),
            }).render(),
            boardContent: new BoardContent(null, {
                lists: workspaceStorage.getBoardLists(this.config.board.board_id),
            }).render(),
        };
        this.parent.insertAdjacentHTML('beforeend', template(page));
    }

    /**
     * Добавляет обработчики событий
     */
    addEventListeners() {
        this.parent.querySelector('.logo-wrapper').addEventListener('click', this.toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=boards]')
            .addEventListener('click', this.toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=logout]')
            .addEventListener('click', this.logoutHandler);
        this.parent
            .querySelector('.profile-link[data-action=profile]')
            .addEventListener('click', this.toProfileHandler);
        this.parent
            .querySelector('.profile-link[data-action=security]')
            .addEventListener('click', this.toSecurityHandler);

        emitter.bind('logout', this.close);
    }

    /**
     * Убирает обработчики событий
     */
    removeEventListeners() {
        this.parent
            .querySelector('.logo-wrapper')
            .removeEventListener('click', this.toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=boards]')
            .removeEventListener('click', this.toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=logout]')
            .removeEventListener('click', this.logoutHandler);
        this.parent
            .querySelector('.profile-link[data-action=profile]')
            .removeEventListener('click', this.toProfileHandler);
        this.parent
            .querySelector('.profile-link[data-action=security]')
            .removeEventListener('click', this.toSecurityHandler);

        emitter.unbind('logout', this.close);
    }

    /**
     * Handler события нажатия на ссылку для перехода на log out
     * @param {Event} e - Событие
     */
    logoutHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionLogout());
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу досок
     * @param {Event} e - Событие
     */
    toBoardsHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/main', false));
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу смены пароля
     * @param {Event} e - Событие
     */
    toSecurityHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/security', false));
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу профиля
     * @param {Event} e - Событие
     */
    toProfileHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/profile', false));
    }

    /**
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/signin', false));
    }
}
