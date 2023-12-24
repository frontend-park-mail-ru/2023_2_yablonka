import { actionNavigate, actionRedirect } from '../../actions/userActions.js';
import BoardContent from '../../components/Board/board/boardContent/boardContent.js';
import Header from '../../components/Common/header/header.js';
import Sidebar from '../../components/Board/sidebar/sidebar.js';
import Component from '../../components/core/basicComponent.js';
import emitter from '../../modules/actionTrigger.js';
import dispatcher from '../../modules/dispatcher.js';
import workspaceStorage from '../../storages/workspaceStorage.js';
import BoardMenu from '../../components/Board/board/boardMenu/boardMenu.js';
import {
    actionCreateCard,
    actionCreateList,
    actionReorderChecklist,
    actionReorderList,
    actionReorderLists,
} from '../../actions/boardActions.js';
import Validator from '../../modules/validator.js';
import NotificationMessage from '../../components/Common/notification/notificationMessage.js';
import template from './board.hbs';
import './board.scss';
import popupEvent from '../../components/core/popeventProcessing.js';
import List from '../../components/Board/board/atomic/list/list.js';
import Card from '../../components/Board/board/atomic/card/card.js';

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

    static #openedCreateMenu = [];

    render() {
        const page = {
            thumbnail_url: this.config.board.thumbnail_url,
            header: new Header(null, {
                avatar: this.config.user.avatar_url,
                isBoard: true,
            }).render(),
            sidebar: new Sidebar(null, {
                workspaceName: workspaceStorage.getWorkspaceById(this.config.board.workspace_id)
                    .workspace_name,
                workspace_id: this.config.board.workspace_id,
                is_owner: workspaceStorage.isOwner(
                    this.config.user.user_id,
                    this.config.board.board_id,
                ),
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
        this.parent.querySelectorAll('.link-sidebar-boards-list__board').forEach((link) => {
            link.addEventListener('click', this.toBoardHandler);
        });
        this.parent.addEventListener('click', this.#addNewEntity);
        this.parent.addEventListener('click', BoardPage.closeAllCreateMenu);
        this.parent.addEventListener('input', this.#blockCreateNewEntityBtn);
        this.parent.addEventListener('click', this.#cancelCreateNewEntityBtn);
        this.parent.addEventListener('click', this.#createEntity);
        this.parent.addEventListener('keydown', this.#proccessKeydownWithEntity);

        this.parent.addEventListener('click', popupEvent.closeAllPopups);
        this.parent.addEventListener('dragstart', this.#dragStartHandler, false);
        this.parent.addEventListener('dragend', this.#dragEndHandler, false);
        this.parent.addEventListener('drop', this.#dropHandler);
        this.parent.addEventListener('dragover', this.#dragoverHandler, false);

        emitter.bind('logout', this.close);
    }

    /**
     * Убирает обработчики событий
     */
    removeEventListeners() {
        this.parent.querySelectorAll('.link-sidebar-boards-list__board').forEach((link) => {
            link.removeEventListener('click', this.toBoardHandler);
        });

        this.parent.removeEventListener('click', this.#addNewEntity);
        this.parent.removeEventListener('click', BoardPage.closeAllCreateMenu);
        this.parent.removeEventListener('input', this.#blockCreateNewEntityBtn);
        this.parent.removeEventListener('click', this.#cancelCreateNewEntityBtn);
        this.parent.removeEventListener('click', this.#createEntity);
        this.parent.removeEventListener('keydown', this.#proccessKeydownWithEntity);

        this.parent.removeEventListener('click', popupEvent.closeAllPopups);
        this.parent.removeEventListener('dragstart', this.#dragStartHandler, false);
        this.parent.removeEventListener('dragend', this.#dragEndHandler, false);
        this.parent.removeEventListener('drop', this.#dropHandler);
        this.parent.removeEventListener('dragover', this.#dragoverHandler, false);

        emitter.unbind('logout', this.close);
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

    #addNewEntity = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.target.closest('button')?.classList.contains('add-new-entity')) {
            BoardPage.closeAllCreateMenu();

            const entityNode =
                e.target.closest('li[data-entity=list]') ||
                e.target.closest('div[data-entity=card]');

            const { entity } = entityNode.dataset;

            const addEntityBtn = entityNode.closest(`.add-new-${entity}`);
            const addEntityForm = addEntityBtn.nextElementSibling;

            addEntityBtn.style.display = 'none';
            addEntityForm.style.display = 'block';

            const input = addEntityForm.querySelector(`.input-new-${entity}-name`);

            input.focus();

            BoardPage.#openedCreateMenu.push({ entity, node: entityNode.nextElementSibling });
        }
    };

    #closeNewEntity = (e) => {
        if (
            e.target.closest('button')?.classList.contains('btn-create_cancel') ||
            e?.key === 'Escape'
        ) {
            e.preventDefault();
            e.stopPropagation();

            const entityNode =
                e.target.closest('li[data-entity=list]') ||
                e.target.closest('div[data-entity=card]');

            const { entity } = entityNode.dataset;

            const addEntityForm = entityNode.closest(`.new-${entity}`);
            const addEntityBtn = addEntityForm.previousElementSibling;

            addEntityForm.querySelector(`.form-new-${entity}__container`).reset();

            addEntityBtn.style.display = 'block';
            addEntityForm.style.display = 'none';

            const idx = BoardPage.#openedCreateMenu.findIndex((node) => node.node === entityNode);
            BoardPage.#openedCreateMenu.splice(idx, idx + 1);
        }
    };

    static closeAllCreateMenu = (e) => {
        if (!e || !(e.target.closest('.new-entity') || e.target.closest('.add-new-entity'))) {
            BoardPage.#openedCreateMenu.forEach((menu) => {
                const menuForm = menu.node.closest(`.new-${menu.entity}`);
                const menuBtn = menu.node.previousElementSibling;

                menuForm.querySelector(`.form-new-${menu.entity}__container`).reset();

                menuBtn.style.display = 'block';
                menuForm.style.display = 'none';

                const btn = menu.node.querySelector(`.btn-create_confirm`);

                btn.disabled = true;
            });

            this.#openedCreateMenu = [];
        }
    };

    #blockCreateNewEntityBtn = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const entityNode =
            e.target.closest('li[data-entity=list]') || e.target.closest('div[data-entity=card]');

        if (entityNode?.classList.contains('new-entity')) {
            const { entity } = entityNode.dataset;

            const btn = entityNode.querySelector(`.btn-create_confirm`);
            const input = entityNode.querySelector(`.input-new-${entity}-name`);

            if (input.value.length === 0) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }
    };

    #cancelCreateNewEntityBtn = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const entityNodeCancelBtn = e.target.closest('button');

        if (entityNodeCancelBtn?.classList.contains('btn-create_cancel')) {
            this.#closeNewEntity(e);
            this.#blockCreateNewEntityBtn(e);
        }
    };

    #proccessKeydownWithEntity = (e) => {
        const entityNode =
            e.target.closest('li[data-entity=list]') || e.target.closest('div[data-entity=card]');

        if (entityNode) {
            e.stopPropagation();
            if (e.key === 'Enter' && entityNode.querySelector('input').value) {
                e.preventDefault();
                this.#createEntity(e);
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                this.#closeNewEntity(e);
            }
        }
    };

    #createEntity = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.target.closest('.btn-create_confirm') || e?.key === 'Enter') {
            const entityNode =
                e.target.closest('li[data-entity=list]') ||
                e.target.closest('div[data-entity=card]');

            const { entity } = entityNode.dataset;

            const input = entityNode.parentNode.querySelector(`.input-new-${entity}-name`);
            const { value } = input;

            if (Validator.validateObjectName(value)) {
                if (entity === 'list') {
                    const boardId = this.parent.querySelector('.board-name__input').dataset.board;

                    await dispatcher.dispatch(
                        actionCreateList({
                            board_id: parseInt(boardId, 10),
                            name: value,
                            list_position: workspaceStorage.getBoardLists(parseInt(boardId, 10))
                                .length,
                        }),
                    );
                } else {
                    const listId = e.target.closest('.list').dataset.list;

                    await dispatcher.dispatch(
                        actionCreateCard({
                            list_id: parseInt(listId, 10),
                            name: value,
                            list_position: workspaceStorage.getListCards(parseInt(listId, 10))
                                .length,
                        }),
                    );
                }
                BoardPage.closeAllCreateMenu();
            } else {
                NotificationMessage.showNotification(input, false, true, {
                    fontSize: 12,
                    fontWeight: 200,
                    text: 'Неккоректное название',
                });
            }
        }
    };

    static addNewList = (list) => {
        const newList = new List(null, {
            id: list.id,
            name: list.name,
            list_position: list.list_position,
            cards: list.cards,
        }).render();

        const lists = document.querySelectorAll('.list');

        if (lists.length) {
            const lastList = lists[lists.length - 1];
            lastList.insertAdjacentHTML('afterend', newList);
        } else {
            const boardContent = document.querySelector('.board__lists');
            boardContent.insertAdjacentHTML('afterbegin', newList);
        }
    };

    static deleteList = (listId) => {
        const list = document.querySelector(`.list[data-list="${listId}"]`);
        list.remove();
    };

    static addNewCard = (card) => {
        const newCard = new Card(null, { id: card.id, name: card.name }).render();

        const cardsContainer = document
            .querySelector(`.list[data-list="${card.list_id}"]`)
            .querySelector('.list__content');

        cardsContainer.insertAdjacentHTML('beforeend', newCard);
    };

    #dragStartHandler = (e) => {
        if (
            e.target.closest('.list__container') ||
            e.target.closest('.list__card') ||
            e.target.closest('.checkitem')
        ) {
            e.stopPropagation();
            if (e.target.closest('.checkitem')) {
                this.#draggingElement = e.target.closest('.checkitem');
            } else {
                this.#draggingElement = e.target.closest('.list__card')
                    ? e.target.closest('.list__card')
                    : e.target.closest('.list__container');
            }
            this.#draggingElement.classList.add('draggable');
        } else {
            e.preventDefault();
        }
    };

    #dragEndHandler = () => {
        this.#draggingElement?.classList.remove('draggable');
    };

    #positioningVertical(mouseCoord, element) {
        const elementCoord = element.getBoundingClientRect();
        const elementCenter = elementCoord.y + elementCoord.height / 2;

        return mouseCoord < elementCenter ? 'beforebegin' : 'afterend';
    }

    #positioningList(mouseCoord, element) {
        const elementCoord = element.getBoundingClientRect();
        const elementCenter = elementCoord.x + elementCoord.width / 2;

        return mouseCoord < elementCenter ? 'beforebegin' : 'afterend';
    }

    #dropHandler = async (e) => {
        e.preventDefault();

        this.#draggingElement?.classList.remove('draggable');

        if (
            e.target.closest('.list') &&
            this.#draggingElement.parentNode.classList.contains('list__card-wrapper')
        ) {
            if (
                e.target.classList.contains('list__card') ||
                e.target.classList.contains('list__card-wrapper')
            ) {
                e.target
                    .closest('.list__card-wrapper')
                    .insertAdjacentHTML(
                        this.#positioningVertical(
                            e.clientY,
                            e.target.closest('.list__card-wrapper'),
                        ),
                        this.#draggingElement.parentNode.outerHTML,
                    );
            } else {
                e.target
                    .closest('.list')
                    .querySelector('.list__content')
                    .insertAdjacentHTML('beforeend', this.#draggingElement.parentNode.outerHTML);
            }
            const ids = [];

            const cardId = parseInt(
                this.#draggingElement.closest('.list__card-wrapper').dataset.card,
                10,
            );

            const oldListId = workspaceStorage.getCardById(parseInt(cardId, 10)).list_id;
            const oldListIds = [];
            workspaceStorage.getListCards(oldListId).forEach((el) => {
                oldListIds.push(el.id);
            });
            this.#draggingElement.parentNode.remove();
            e.target
                .closest('.list')
                .querySelectorAll('.list__card-wrapper')
                .forEach((c) => {
                    ids.push(parseInt(c.dataset.card, 10));
                });

            const listId = parseInt(e.target.closest('.list').dataset.list, 10);

            await dispatcher.dispatch(
                actionReorderList({
                    old_list: { id: oldListId, task_ids: oldListIds },
                    new_list: { id: listId, task_ids: ids },
                    task_id: cardId,
                }),
            );
        } else if (
            e.target.closest('.list') &&
            this.#draggingElement.parentNode.classList.contains('list')
        ) {
            e.target
                .closest('.list')
                .insertAdjacentHTML(
                    this.#positioningList(e.clientX, e.target.closest('.list')),
                    this.#draggingElement.parentNode.outerHTML,
                );
            this.#draggingElement.parentNode.remove();
            const ids = [];
            this.parent.querySelectorAll('.list').forEach((el) => {
                ids.push(parseInt(el.dataset.list, 10));
            });
            await dispatcher.dispatch(actionReorderLists({ ids }));
        } else if (
            e.target.closest('.checkitem') &&
            this.#draggingElement.classList.contains('checkitem')
        ) {
            if (
                e.target.closest('.card-information__checklist-wrapper')?.dataset.checklist !==
                this.#draggingElement.dataset.checklist_id
            ) {
                this.parent.querySelector('.temp-dragged')?.remove();
                this.#draggingElement = null;
                return;
            }
            e.target
                .closest('.checkitem')
                .insertAdjacentHTML(
                    this.#positioningVertical(e.clientY, e.target.closest('.checkitem')),
                    this.#draggingElement.outerHTML,
                );
            this.#draggingElement.remove();
            const ids = [];
            e.target
                .closest('.card-information__checklist-wrapper')
                .querySelectorAll('.checkitem')
                .forEach((el) => {
                    ids.push(parseInt(el.dataset.checkitem_id, 10));
                });

            await dispatcher.dispatch(actionReorderChecklist({ ids }));
        }
        this.parent.querySelector('.temp-dragged')?.remove();

        this.#draggingElement = null;
    };

    #dragoverHandler = (e) => {
        e.preventDefault();
    };

    /**
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/signin', false));
    }
}
