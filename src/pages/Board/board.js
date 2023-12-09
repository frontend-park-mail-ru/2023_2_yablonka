import { actionLogout, actionNavigate, actionRedirect } from '../../actions/userActions.js';
import BoardContent from '../../components/Board/board/boardContent/boardContent.js';
import Header from '../../components/Common/header/header.js';
import Sidebar from '../../components/Board/sidebar/sidebar.js';
import Component from '../../components/core/basicComponent.js';
import emitter from '../../modules/actionTrigger.js';
import dispatcher from '../../modules/dispatcher.js';
import workspaceStorage from '../../storages/workspaceStorage.js';
import BoardMenu from '../../components/Board/board/boardMenu/boardMenu.js';
import { actionCreateCard, actionCreateList } from '../../actions/boardActions.js';
import Validator from '../../modules/validator.js';
import NotificationMessage from '../../components/Common/notification/notificationMessage.js';
import template from './board.hbs';
import './board.scss';
import popupEvent from '../../components/core/popeventProcessing.js';

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

    #draggingElement;
    #elementDisplay;
    render() {
        const page = {
            thumbnail_url: this.config.board.thumbnail_url,
            header: new Header(null, { avatar: this.config.user.avatar_url }).render(),
            sidebar: new Sidebar(null, {
                workspaceName: workspaceStorage.getWorkspaceById(this.config.board.workspace_id)
                    .workspace_name,
                workspace_id: this.config.board.workspace_id,
                user_id: this.config.user.user_id,
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
        this.parent.querySelectorAll('.link-sidebar-boards-list__board').forEach((link) => {
            link.addEventListener('click', this.toBoardHandler);
        });
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

        this.parent
            .querySelector('.btn-add-new-list')
            .addEventListener('click', this.#addNewEntity);
        this.parent.querySelectorAll('.btn-add-new-card').forEach((btn) => {
            btn.addEventListener('click', this.#addNewEntity);
        });
        this.parent
            .querySelector('.input-new-list-name')
            .addEventListener('input', this.#blockCreateNewEntityBtn);
        this.parent.querySelectorAll('.input-new-card-name').forEach((btn) => {
            btn.addEventListener('input', this.#blockCreateNewEntityBtn);
        });
        this.parent
            .querySelector('.btn-create-list_cancel')
            .addEventListener('click', this.#cancelCreateNewEntityBtn);
        this.parent.querySelectorAll('.btn-create-card').forEach((btn) => {
            btn.addEventListener('click', this.#cancelCreateNewEntityBtn);
        });
        this.parent
            .querySelector('.btn-create-list_confirm')
            .addEventListener('click', this.#createEntity);
        this.parent.querySelectorAll('.btn-create-card_confirm').forEach((btn) => {
            btn.addEventListener('click', this.#createEntity);
        });
        this.parent.addEventListener('click', popupEvent.closeAllPopups);
        this.parent.querySelector('.board__main-content').addEventListener('drag', this.#dragHandler);
        this.parent.querySelector('.board__main-content').addEventListener('drop', this.#dropHandler);
        this.parent.querySelector('.board__main-content').addEventListener('dragover', this.#dragoverHandler);

        emitter.bind('logout', this.close);
    }

    /**
     * Убирает обработчики событий
     */
    removeEventListeners() {
        this.parent
            .querySelector('.logo-wrapper')
            .removeEventListener('click', this.toBoardsHandler);
        this.parent.querySelectorAll('.link-sidebar-boards-list__board').forEach((link) => {
            link.removeEventListener('click', this.toBoardHandler);
        });
        this.parent
            .querySelector('.profile-link[data-action=logout]')
            .removeEventListener('click', this.logoutHandler);
        this.parent
            .querySelector('.profile-link[data-action=boards]')
            .removeEventListener('click', this.toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=profile]')
            .removeEventListener('click', this.toProfileHandler);
        this.parent
            .querySelector('.profile-link[data-action=security]')
            .removeEventListener('click', this.toSecurityHandler);

        this.parent
            .querySelector('.btn-add-new-list')
            .addEventListener('click', this.#addNewEntity);
        this.parent.querySelectorAll('.btn-add-new-card').forEach((btn) => {
            btn.addEventListener('click', this.#addNewEntity);
        });
        this.parent
            .querySelector('.input-new-list-name')
            .removeEventListener('input', this.#blockCreateNewEntityBtn);
        this.parent.querySelectorAll('.input-new-card-name').forEach((btn) => {
            btn.removeEventListener('input', this.#blockCreateNewEntityBtn);
        });
        this.parent
            .querySelector('.btn-create-list_cancel')
            .removeEventListener('click', this.#cancelCreateNewEntityBtn);
        this.parent.querySelectorAll('.btn-create-card').forEach((btn) => {
            btn.removeEventListener('click', this.#cancelCreateNewEntityBtn);
        });
        this.parent
            .querySelector('.btn-create-list_confirm')
            .removeEventListener('click', this.#createEntity);
        this.parent.querySelectorAll('.btn-create-card_confirm').forEach((btn) => {
            btn.removeEventListener('click', this.#createEntity);
        });
        this.parent.removeEventListener('click', popupEvent.closeAllPopups);

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
     * Handler события нажатия на ссылку для перехода на страницу доски
     * @param {Event} e - Событие
     */
    toBoardsHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/main', false));
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу досок
     * @param {Event} e - Событие
     */
    toBoardHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(
            actionRedirect(e.target.closest('a').href.replace(window.location.origin, ''), false),
        );
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

    #addNewEntity = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const entityNode = e.target.closest('li[data-entity=list]') || e.target.closest('div[data-entity=card]');
        const { entity } = entityNode.dataset;

        const addEntityBtn = entityNode.parentNode.querySelector(`.add-new-${entity}`);
        const addEntityForm = entityNode.parentNode.querySelector(`.new-${entity}`);

        addEntityBtn.style.display = 'none';
        addEntityForm.style.display = 'block';

        const input = entityNode.parentNode.querySelector(`.input-new-${entity}-name`);
        input.blur();
    };

    #closeNewEntity = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const entityNode = e.target.closest('li[data-entity=list]') || e.target.closest('div[data-entity=card]');

        const { entity } = entityNode.dataset;

        entityNode.parentNode.querySelector(`.form-new-${entity}__container`).reset();

        const addEntityBtn = entityNode.parentNode.querySelector(`.add-new-${entity}`);
        const addEntityForm = entityNode.parentNode.querySelector(`.new-${entity}`);

        addEntityBtn.style.display = 'block';
        addEntityForm.style.display = 'none';
    };

    #blockCreateNewEntityBtn = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const entityNode = e.target.closest('li[data-entity=list]') || e.target.closest('div[data-entity=card]');

        const { entity } = entityNode.dataset;

        const btn = entityNode.parentNode.querySelector(`.btn-create-${entity}_confirm`);
        const input = entityNode.parentNode.querySelector(`.input-new-${entity}-name`);

        if (input.value.length === 0) {
            btn.disabled = true;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--need-text-color)');
        } else {
            btn.disabled = false;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--main-btn-border-color)');
        }
    };

    #cancelCreateNewEntityBtn = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const entityNode = e.target.closest('li[data-entity=list]') || e.target.closest('div[data-entity=card]');

        const { entity } = entityNode.dataset;
        if (
            entityNode.parentNode.querySelector(`.new-${entity}`)?.style.display === 'block' && e.target.closest(`.btn-create-${entity}_cancel`)
        ) {
            this.#closeNewEntity(e);
            this.#blockCreateNewEntityBtn(e);
        }
    };

    #createEntity = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const entityNode = e.target.closest('li[data-entity=list]') || e.target.closest('div[data-entity=card]');

        const { entity } = entityNode.dataset;

        const input = entityNode.parentNode.querySelector(`.input-new-${entity}-name`);
        const { value } = input;

        if (Validator.validateObjectName(value)) {
            this.#closeNewEntity(e);
            this.#blockCreateNewEntityBtn(e);

            if (entity === 'list') {
                const boardId = this.parent.querySelector('.input-board-name__input').dataset.board;

                dispatcher.dispatch(
                    actionCreateList({
                        board_id: parseInt(boardId, 10),
                        name: value,
                        list_position: workspaceStorage.getBoardLists(parseInt(boardId, 10)).length,
                    }),
                );
            } else {
                const listId = e.target.closest('.list').dataset.list;

                dispatcher.dispatch(
                    actionCreateCard({
                        list_id: parseInt(listId, 10),
                        name: value,
                        list_position: workspaceStorage.getListCards(parseInt(listId, 10)).length,
                    }),
                );
            }
        } else {
            NotificationMessage.showNotification(input, false, true, {
                fontSize: 12,
                fontWeight: 200,
                text: 'Неккоректное название',
            });
        }
    };

    #dragHandler = (e)=>{
        e.preventDefault();

        this.#draggingElement = e.target;
    }

    #dropHandler = (e)=>
    {
        e.preventDefault();
        console.log(e.target, this.#draggingElement.classList)
        if(e.target.closest('.list')&&this.#draggingElement.classList.contains('list__card-wrapper')){
            if(e.target.classList.contains('list__card')|| e.target.classList.contains('list__card-wrapper')){
                e.target.closest('.list__card-wrapper').insertAdjacentHTML('afterend',this.#draggingElement.outerHTML);
            }
            else
            {
                e.target.closest('.list').querySelector('.list__content').insertAdjacentHTML('beforeend', this.#draggingElement.outerHTML);
            }
            this.#draggingElement.outerHTML ='';
            this.#draggingElement = null;

        }
        else if(e.target.closest('.list')&&this.#draggingElement.classList.contains('list')){
                e.target.closest('.list').insertAdjacentHTML('afterend',this.#draggingElement.outerHTML);
                this.#draggingElement.outerHTML ='';
                this.#draggingElement = null;
        }

    }

    #dragoverHandler = (e)=>{
        e.preventDefault();
    }

    /**
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/signin', false));
    }
}
