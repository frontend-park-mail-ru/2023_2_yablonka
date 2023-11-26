import { actionLogout, actionNavigate, actionRedirect } from '../../actions/userActions.js';
import BoardContent from '../../components/Board/board/boardContent/boardContent.js';
import Header from '../../components/Common/header/header.js';
import Sidebar from '../../components/Board/sidebar/sidebar.js';
import Component from '../../components/core/basicComponent.js';
import emitter from '../../modules/actionTrigger.js';
import dispatcher from '../../modules/dispatcher.js';
import workspaceStorage from '../../storages/workspaceStorage.js';
import BoardMenu from '../../components/Board/board/boardMenu/boardMenu.js';
import { actionCreateList } from '../../actions/boardActions.js';
import Validator from '../../modules/validator.js';
import NotificationMessage from '../../components/Common/notification/notificationMessage.js';
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
                board_id: this.config.board.board_id,
                name: this.config.board.name,
                users: workspaceStorage.getBoardUsers(),
            }).render(),
            boardContent: new BoardContent(null, {
                lists: workspaceStorage.getBoardLists(),
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

        this.parent.querySelector('.btn-add-new-list').addEventListener('click', this.#addNewList);
        this.parent
            .querySelector('.input-new-list-name')
            .addEventListener('input', this.#blockCreateNewListBtn);
        this.parent
            .querySelector('.btn-create-list_cancel')
            .addEventListener('click', this.#cancelCreateNewListBtn);
        this.parent.addEventListener('click', this.#cancelCreateNewListBtn);
        this.parent
            .querySelector('.btn-create-list_confirm')
            .addEventListener('click', this.#createList);

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

        this.parent
            .querySelector('.btn-add-new-list')
            .removeEventListener('click', this.#addNewList);
        this.parent
            .querySelector('.input-new-list-name')
            .removeEventListener('input', this.#blockCreateNewListBtn);
        this.parent
            .querySelector('.btn-create-list_cancel')
            .removeEventListener('click', this.#cancelCreateNewListBtn);
        this.parent.addEventListener('click', this.#cancelCreateNewListBtn);
        this.parent
            .querySelector('.btn-create-list_confirm')
            .removeEventListener('click', this.#createList);

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

    #addNewList = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const addListBtn = this.parent.querySelector('.add-new-list');
        const addListForm = this.parent.querySelector('.new-list');

        addListBtn.style.display = 'none';
        addListForm.style.display = 'block';

        const input = this.parent.querySelector('.input-new-list-name');
        input.blur();
    };

    #closeNewList = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.parent.querySelector('.form-new-list__container').reset();

        const addListBtn = this.parent.querySelector('.add-new-list');
        const addListForm = this.parent.querySelector('.new-list');

        addListBtn.style.display = 'block';
        addListForm.style.display = 'none';
    };

    #blockCreateNewListBtn = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const btn = this.parent.querySelector('.btn-create-list_confirm');
        const input = this.parent.querySelector('.input-new-list-name');

        if (input.value.length === 0) {
            btn.disabled = true;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--need-text-color)');
        } else {
            btn.disabled = false;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--main-btn-border-color)');
        }
    };

    #cancelCreateNewListBtn = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (
            this.parent.querySelector('.new-list').style.display === 'block' &&
            e.target.closest('.btn-create-list_cancel')
        ) {
            this.#closeNewList(e);
            this.#blockCreateNewListBtn(e);
        }
    };

    #createList = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const input = this.parent.querySelector('.input-new-list-name');
        const { value } = input;

        if (Validator.validateObjectName(value)) {
            const boardId = this.parent.querySelector('.board-menu__board-name').dataset.board;

            this.#closeNewList(e);
            this.#blockCreateNewListBtn(e);

            dispatcher.dispatch(
                actionCreateList({
                    board_id: parseInt(boardId, 10),
                    name: value,
                    list_position: workspaceStorage.getBoardLists(parseInt(boardId, 10)).length,
                }),
            );
        } else {
            NotificationMessage.showNotification(input, false, true, {
                fontSize: 12,
                fontWeight: 200,
                text: 'Некорректное название списка',
            });
        }
    };

    /**
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/signin', false));
    }
}
