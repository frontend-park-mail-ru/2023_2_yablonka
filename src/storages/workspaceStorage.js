import BaseStorage from './baseStorage.js';
import AJAX from '../modules/ajax.js';
import { apiPath, apiVersion } from '../configs/configs.js';
import userStorage from './userStorage.js';
import emitter from '../modules/actionTrigger.js';
import NotificationMessage from '../components/Common/notification/notificationMessage.js';
import popupEvent from '../components/core/popeventProcessing.js';
import Card from '../components/Card/card.js';
import AddChecklist from '../components/Card/popups/addChecklist/addChecklist.js';
import BoardPage from '../pages/Board/board.js';
import dispatcher from '../modules/dispatcher.js';
import { actionNavigate, actionRedirect } from '../actions/userActions.js';
import TagSettings from '../components/Card/popups/tagSettings/tagSettings.js';

/**
 * Хранилище объекта "рабочее пространство"
 * @class
 */
class WorkspaceStorage extends BaseStorage {
    workspaceModel = {
        body: 'body',
        status: 'status',
        boards: 'boards',
        lists: 'lists',
        cards: 'cards',
        users: 'users',
        comments: 'comments',
        checklists: 'checklists',
        items: 'items',
        files: 'files',
        history: 'history',
        tags: 'tags',
    };

    /**
     * @constructor
     */
    constructor() {
        super();
        this.storage.set(this.workspaceModel.body, undefined);
        this.storage.set(this.workspaceModel.boards, []);
        this.storage.set(this.workspaceModel.lists, []);
        this.storage.set(this.workspaceModel.cards, []);
        this.storage.set(this.workspaceModel.users, []);
        this.storage.set(this.workspaceModel.comments, []);
        this.storage.set(this.workspaceModel.checklists, []);
        this.storage.set(this.workspaceModel.items, []);
        this.storage.set(this.workspaceModel.files, []);
        this.storage.set(this.workspaceModel.history, []);
        this.storage.set(this.workspaceModel.tags, []);
    }

    /**
     * Метод для получения рабочих пространств пользователя
     */
    async getWorkspaces() {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}user/workspaces`,
            'GET',
            userStorage.storage.get(userStorage.userModel.csrf),
        );

        let body;
        try {
            body = await responsePromise.json();
        } catch (error) {
            body = {
                workspaces: {
                    yourWorkspaces: [],
                    guestWorkspaces: [],
                },
            };
        }

        const { status } = responsePromise;

        this.storage.set(this.workspaceModel.body, body);

        this.storage.set(this.workspaceModel.status, status);
    }

    /**
     * Создание рабочего пространства
     * @param {Object} newWorkspace - данные рабочего пространства
     */
    async createWorkspace(newWorkspace) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}workspace/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            newWorkspace,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        }
    }

    /**
     * Удаление рабочего пространства
     * @param {Object} workspace - удаляемое рабочее пространство
     */
    async deleteWorkspace(workspace) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}workspace/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            workspace,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        } else {
            // Тут короче будем триггер на ошибки делать
        }
    }

    /**
     * Обновление рабочего пространства
     * @param {Object} newWorkspace - обновленные данные рабочего пространства
     */
    async updateWorkspace(newWorkspace) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}workspace/update/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            newWorkspace,
        );

        const { status } = responsePromise;

        if (status !== 200) {
            emitter.trigger('rerender');
        }
    }

    /**
     * Получение доски с содержимым
     * @param {Object} board - объект с id доски
     */
    async getBoard(board) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}board/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            board,
        );

        let body;
        try {
            body = await responsePromise.json();
        } catch (error) {
            body = {};
        }

        const { status } = responsePromise;

        if (status === 200) {
            console.log(structuredClone(body));
            this.addBoard(body.body.board);
            this.storage.set(this.workspaceModel.lists, body.body.lists);
            this.storage.set(this.workspaceModel.cards, body.body.cards);
            this.storage.set(this.workspaceModel.users, body.body.users);
            this.storage.set(this.workspaceModel.comments, body.body.comments);
            this.storage.set(this.workspaceModel.checklists, body.body.checklists);
            this.storage.set(this.workspaceModel.items, body.body.checklist_items);
            this.storage.set(this.workspaceModel.tags, body.body.tags);
        } else {
            dispatcher.dispatch(actionNavigate(window.location.pathname, '', false));
            dispatcher.dispatch(actionRedirect('/404', false));
        }
    }

    /**
     * Создание доски
     * @param {Object} board - объект новой доски
     */
    async createBoard(board) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}board/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            board,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        } else if (status === 403) {
            emitter.trigger('noaccess');
        }
    }

    /**
     * Удаление доски
     * @param {Object} board - удаляемая доска
     */
    async deleteBoard(board) {
        await AJAX(
            `${apiPath + apiVersion}board/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            board,
        );
    }

    /**
     * Обновление доски
     * @param {Object} board - обновленные данные доски
     */
    async updateBoard(board) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}board/update/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            board,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const oldBoard = this.getBoardById(board.id);
            if (oldBoard.name !== board.name) {
                oldBoard.name = board.name;
                document
                    .querySelector(`.link-sidebar-boards-list__board[data-board="${board.id}"]`)
                    .querySelector('.sidebar-boards-list__board-name').textContent = board.name;
            } else {
                emitter.trigger('rerender');
            }
        }
    }

    /**
     * Создание списка карточек
     * @param {Object} list - данные нового списка
     */
    async createList(list) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}list/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            list,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const body = await responsePromise.json();
            const newList = {
                id: body.body.list.id,
                name: body.body.list.name,
                cards: body.body.list.tasks,
                list_position: body.body.list.list_position,
                board_id: body.body.list.board_id,
            };

            this.storage.get(this.workspaceModel.lists).push(newList);
            BoardPage.addNewList(newList);
            BoardPage.closeAllCreateMenu();
        }
    }

    /**
     * Обновление списка карточек
     * @param {Object} list - обновленные данные списка
     */
    async updateList(list) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}list/edit/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            list,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const lst = this.getListById(parseInt(list.id, 10));
            lst.name = list.name;
        }
    }

    /**
     * Удаление списка карточек
     * @param {Object} list - удаляемый список
     */
    async deleteList(list) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}list/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            list,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const lists = this.storage.get(this.workspaceModel.lists);
            const idx = lists.findIndex((lst) => lst.id === parseInt(list.id, 10));
            lists.splice(idx, 1);

            lists.forEach((lst, position) => {
                lst.list_position = position;
            });

            BoardPage.deleteList(parseInt(list.id, 10));
        }
    }

    /**
     * Переупорядочивание списка карточек
     * @param {Object} ids - массив с id карточек
     */
    async reorderList(ids) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}task/move/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            ids,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const cards = this.storage.get(this.workspaceModel.cards);
            cards.forEach((el) => {
                if (el.id === ids.task_id) {
                    el.list_id = ids.new_list.id;
                }
            });
            ids.old_list.task_ids.forEach((id, index) => {
                const idx = cards.findIndex((c) => c.id === id);
                cards[idx].list_position = index;
            });
            ids.new_list.task_ids.forEach((id, index) => {
                const idx = cards.findIndex((c) => c.id === id);
                cards[idx].list_position = index;
            });
            this.storage.set(this.workspaceModel.cards, cards);

            const lists = this.storage.get(this.workspaceModel.lists);
            lists.forEach((el) => {
                if (el.id === ids.old_list.id) {
                    el.cards.splice(
                        el.cards.findIndex((c) => parseInt(c, 10) === parseInt(ids.task_id, 10)),
                        1,
                    );
                }
            });
            lists.forEach((el) => {
                if (el.id === ids.new_list.id) {
                    el.cards = ids.new_list.task_ids;
                }
            });
            this.storage.set(this.workspaceModel.lists, lists);
        }
    }

    /**
     * Переупорядочивание списков карточек
     * @param {Object} ids - массив с id списков
     */
    async reorderLists(ids) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}list/reorder/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            ids,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const lists = this.storage.get(this.workspaceModel.lists);
            ids.ids.forEach((el, index) => {
                const idx = lists.findIndex((lst) => lst.id === el);
                lists[idx].list_position = index;
            });
            this.storage.set(this.workspaceModel.lists, lists);
        }
    }

    /**
     * Создание новой карточки
     * @param {Object} card - Данные новой карточки
     */
    async createCard(card) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}task/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            card,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const body = await responsePromise.json();
            const list = this.getListById(parseInt(body.body.task.list_id, 10));

            this.storage.get(this.workspaceModel.cards).push(body.body.task);
            list.cards.push(`${body.body.task.id}`);

            BoardPage.addNewCard(body.body.task);
        }
    }

    /**
     * Обновление карточки
     * @param {Object} card - обновлённые данные карточки
     */
    async updateCard(card) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}task/edit/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            card,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const oldCard = this.getCardById(card.id);
            if (oldCard.start !== card.start || oldCard.end !== card.end) {
                oldCard.start = card.start;
                oldCard.end = card.end;
                Card.addDate(card.id);
            } else if (oldCard.name !== card.name || oldCard.description !== card.description) {
                oldCard.name = card.name;
                oldCard.description = card.description;
                Card.changeNameAndDescriptionHelper(card.id);
            }
        }
    }

    /**
     * Удаление карточки
     * @param {Object} card - Удаляемая карточка
     */
    async deleteCard(card) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}task/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            card,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const deletedCard = this.getCardById(card.id);
            const list = this.getListById(deletedCard.list_id);

            list.cards.forEach((cardId) => {
                const listCard = this.getCardById(parseInt(cardId, 10));
                if (listCard.list_position > deletedCard.list_position) {
                    list.list_position -= 1;
                }
            });
            const idxList = list.cards.findIndex((itemId) => itemId === `${card.id}`);
            list.cards.splice(idxList, 1);

            const idxCard = this.storage
                .get(this.workspaceModel.cards)
                .findIndex((item) => item.id === card.id);

            this.storage.get(this.workspaceModel.cards).splice(idxCard, 1);

            Card.clearCard(true);
        }
    }

    async getCardFiles(card) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}task/file/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            card,
        );

        let body;
        try {
            body = await responsePromise.json();
        } catch (error) {
            body = {};
        }

        const { status } = responsePromise;

        if (status === 200) {
            this.storage.set(this.workspaceModel.files, body.body.files);
        }
    }

    async attachFile(file) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}task/file/attach/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            file,
        );

        const { status } = responsePromise;

        if (status === 200) {
            Card.getFiles();
        }
    }

    async deleteFile(file) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}task/file/remove/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            file,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const files = this.storage.get(this.workspaceModel.files);
            files.splice(files.findIndex((f) => f.file_path === file.file_path));
            this.storage.set(this.workspaceModel.files, files);
            const oldFile = document
                .querySelector(`a[href="/${file.file_path}"]`)
                .closest('.card-information__file-wrapper');
            oldFile.remove();

            if (!document.querySelectorAll('.card-information__file-wrapper').length) {
                document.querySelector('.card-information__files').remove();
            }
        }
    }

    async createTag(tag) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}tag/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            tag,
        );

        let body;
        try {
            body = await responsePromise.json();
        } catch (error) {
            body = {};
        }

        const { status } = responsePromise;

        if (status === 200) {
            const tags = this.storage.get(this.workspaceModel.tags);
            const card = this.getCardById(parseInt(body.body.tag.task_id, 10));
            tags.push(body.body.tag);
            card.tags.push(`${body.body.tag.id}`);

            Card.addTag(body.body.tag);
            BoardPage.addTag(body.body.tag);
        }
    }

    async attachTag(tag) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}tag/add_to_task/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            tag,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const cards = this.storage.get(this.workspaceModel.cards);
            cards.forEach((c) => {
                if (c.id === tag.task_id) {
                    c.tags.push(`${tag.tag_id}`);
                }
            });

            const attachedTag = {
                ...this.getTagById(parseInt(tag.tag_id, 10)),
                task_id: tag.task_id,
            };
            Card.addTag(attachedTag);
            BoardPage.addTag(attachedTag);
        }
    }

    async detachTag(tag) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}tag/remove_from_task/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            tag,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const cards = this.storage.get(this.workspaceModel.cards);

            cards.forEach((c) => {
                if (c.id === tag.task_id) {
                    const delInd = c.tags.findIndex(
                        (t) => parseInt(t, 10) === parseInt(tag.tag_id, 10),
                    );
                    c.tags.splice(delInd, 1);
                }
            });

            const detachedTag = this.getTagById(parseInt(tag.tag_id, 10));
            Card.removeTag(detachedTag);
            BoardPage.removeTag({ ...detachedTag, task_id: tag.task_id });
            TagSettings.filterCards();
        }
    }

    async updateTag(tag) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}tag/update/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            tag,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const tags = this.storage.get(this.workspaceModel.tags);
            tags.forEach((t) => {
                if (t.id === tag.id) {
                    t.name = tag.name;
                }
            });
            this.workspaceStorage.set(this.workspaceModel.tags, tags);
        }
    }

    async deleteTag(tag) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}tag/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            tag,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const deletedTag = this.getTagById(parseInt(tag.tag_id, 10));
            Card.removeTag(deletedTag);
            BoardPage.deleteTag(deletedTag);
            TagSettings.filterCards();

            const tags = this.storage.get(this.workspaceModel.tags);
            const tagDelInd = tags.findIndex((t) => t.id === tag.tag_id);
            tags.splice(tagDelInd, 1);

            const cards = this.storage.get(this.workspaceModel.cards);

            cards.forEach((c) => {
                const delInd = c.tags.findIndex(
                    (t) => parseInt(t, 10) === parseInt(tag.tag_id, 10),
                );
                c.tags.splice(delInd, 1);
            });
        }
    }

    /**
     * Создание нового чеклиста
     * @param {Object} checklist - данные нового чеклиста
     */
    async createChecklist(checklist) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}checklist/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            checklist,
        );

        const { status } = responsePromise;
        let body;

        if (status === 200) {
            const boardChecklists = this.storage.get(this.workspaceModel.checklists);
            const cardChecklists = this.getCardById(parseInt(checklist.task_id, 10)).checklists;

            body = await responsePromise.json();
            boardChecklists.push(body.body.checklist);
            boardChecklists.sort((f, s) => parseInt(f.id, 10) < parseInt(s.id, 10));

            cardChecklists.push(`${body.body.checklist.id}`);
            cardChecklists.sort((f, s) => parseInt(f.id, 10) < parseInt(s.id, 10));

            AddChecklist.addChecklist(body.body.checklist);
        }
    }

    /**
     * Обновление чеклиста
     * @param {Object} checklist - обноавленные данные чеклиста
     */
    async updateChecklist(checklist) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}checklist/edit/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            checklist,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        }
    }

    /**
     * Удаление чеклиста
     * @param {Object} checklist - удаляемый чеклист
     */
    async deleteChecklist(checklist) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}checklist/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            checklist,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const boardChecklists = this.storage.get(this.workspaceModel.checklists);
            const cardChecklists = this.getCardById(
                this.getChecklistById(checklist.id).task_id,
            ).checklists;

            const boardChecklistInd = boardChecklists.findIndex(
                (checklistElement) =>
                    parseInt(checklistElement.id, 10) === parseInt(checklist.id, 10),
            );
            boardChecklists.splice(boardChecklistInd, 1);

            const cardChecklistInd = cardChecklists.findIndex(
                (checklistId) => parseInt(checklistId, 10) === parseInt(checklist.id, 10),
            );
            cardChecklists.splice(cardChecklistInd, 1);

            AddChecklist.deleteChecklist(parseInt(checklist.id, 10));
        }
    }

    /**
     * Создание нового пункта чеклиста
     * @param {Object} checklistItem - данные нового пункта чеклиста
     */
    async createChecklistItem(checklistItem) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}checklist/item/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            checklistItem,
        );

        const { status } = responsePromise;
        let body;

        if (status === 200) {
            body = await responsePromise.json();

            const checklistItems = this.storage.get(this.workspaceModel.items);
            const checklist = this.getChecklistById(parseInt(checklistItem.checklist_id, 10));

            checklistItems.push(body.body.checklistItem);
            checklist.items.push(`${body.body.checklistItem.id}`);

            AddChecklist.addCheckItem(body.body.checklistItem);
        }
    }

    /**
     * Обновление пункта чеклиста
     * @param {Object} checklistItem - обновленные данные пункта чеклиста
     */
    async updateChecklistItem(checklistItem) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}checklist/item/edit/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            checklistItem,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const oldChecklistItem = this.getChecklistItemById(checklistItem.id);
            if (oldChecklistItem.done !== checklistItem.done) {
                oldChecklistItem.done = checklistItem.done;
            }
        }
    }

    /**
     * Перестановка пунктов чеклиста
     * @param {Object} ids - обновленный порядок id
     */
    async reorderChecklistItems(ids) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}checklist/item/reorder/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            ids,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const items = this.storage.get(this.workspaceModel.items);
            ids.ids.forEach((el, index) => {
                const idx = items.findIndex((lst) => lst.id === el);
                items[idx].list_position = index;
            });
            this.storage.set(this.workspaceModel.items, items);
        }
    }

    /**
     * Удаление пункта чеклиста
     * @param {Object} checklistItem - удаляемый пункт чеклиста
     */
    async deleteChecklistItem(checklistItem) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}checklist/item/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            checklistItem,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const checklistItems = this.storage.get(this.workspaceModel.items);
            const { items } = this.getChecklistById(
                this.getChecklistItemById(checklistItem.id).checklist_id,
            );

            const checklistItemInd = checklistItems.findIndex(
                (item) => parseInt(item.id, 10) === parseInt(checklistItem.id, 10),
            );
            checklistItems.splice(checklistItemInd, 1);

            const itemId = items.findIndex(
                (item) => parseInt(item, 10) === parseInt(checklistItem.id, 10),
            );
            items.splice(itemId, 1);

            AddChecklist.deleteCheckItem(parseInt(checklistItem.id, 10));
        }
    }

    /**
     * Комментирование карточки
     * @param {Object} comment - новый коммент
     */
    async commentCard(comment) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}comment/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            comment,
        );

        const { status } = responsePromise;
        let body;

        if (status === 200) {
            const comments = this.storage.get(this.workspaceModel.comments);

            body = await responsePromise.json();
            const newComment = {
                id: body.body.comment.id,
                user_id: body.body.comment.user_id,
                text: body.body.comment.text,
                date_created: body.body.comment.date_created,
            };

            const card = this.getCardById(parseInt(body.body.comment.task_id, 10));
            card.comments.push(`${newComment.id}`);

            comments.push(newComment);

            Card.addComment(newComment);
        }
    }

    /**
     * Добавление юзера на доску
     * @param {Object} user - пользователь, добавляемый на доску
     */
    async addUser(user) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}board/user/add/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            user,
        );

        const { status } = responsePromise;

        if (status === 200) {
            popupEvent.closeAllPopups();
            emitter.trigger('rerender');
        } else if (status === 401) {
            const email = document.querySelector('.input-add-board-user-content__input');

            NotificationMessage.showNotification(email, false, true, {
                fontSize: 12,
                fontWeight: 200,
                text: 'Такого пользователя не существует',
            });
        }
    }

    /**
     * Удаление юзера с доски
     * @param {Object} user - удаляемый юзер
     */
    async removeUser(user) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}board/user/remove/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            user,
        );

        const { status } = responsePromise;

        if (status === 200) {
            popupEvent.closeAllPopups();
            emitter.trigger('rerender');
        }
    }

    /**
     * Добавление юзера на карточку
     * @param {Object} user - пользователь, добавляемый на карточку
     */
    async addUserCard(data) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}task/user/add/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            data,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const currentCardUserIds = this.storage
                .get(this.workspaceModel.cards)
                .find((crd) => crd.id === data.task_id).users;
            currentCardUserIds.push(`${data.user_id}`);

            currentCardUserIds.sort((f, s) => parseInt(f, 10) < parseInt(s, f));

            Card.updateUsers(parseInt(data.task_id, 10));
        }
    }

    /**
     * Удаление юзера с карточки
     * @param {Object} user - удаляемый юзер
     */
    async removeUserCard(data) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}task/user/remove/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            data,
        );

        const { status } = responsePromise;

        if (status === 200) {
            const currentCardUserIds = this.storage
                .get(this.workspaceModel.cards)
                .find((crd) => crd.id === data.task_id).users;

            const ind = currentCardUserIds.findIndex(
                (userId) => parseInt(userId, 10) === data.user_id,
            );

            currentCardUserIds.splice(ind, 1);

            Card.updateUsers(parseInt(data.task_id, 10));
        }
    }

    async getHistory(board) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}board/history/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            board,
        );

        const { status } = responsePromise;

        let body;
        try {
            body = await responsePromise.json();
        } catch (error) {
            body = {};
        }

        if (status === 200) {
            this.storage.set(this.workspaceModel.history, body.body.history);
        }
    }

    async submitHistoryAction(action) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}board/history/submit/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            action,
        );
    }

    /**
     * Добавление доски в хранилище
     * @param {Object} board - объект добавляемой в хранилище доски
     */
    addBoard(board) {
        const idx = this.storage
            .get(this.workspaceModel.boards)
            .findIndex((brd) => brd.board_id === board.board_id);
        const boards = this.storage.get(this.workspaceModel.boards);
        if (idx !== -1) {
            boards.splice(idx, 1);
        }
        boards.push(board);
        this.storage.set(this.workspaceModel.boards, boards);
    }

    /**
     * Получение workspace по его id
     * @param {Number} id - id рабочего пространства
     * @returns {Object} - объект рабочего пространства
     */
    getWorkspaceById(id) {
        const workspaces = this.storage.get(this.workspaceModel.body);
        let workspace = workspaces.body.workspaces.yourWorkspaces?.find(
            (ws) => ws.workspace_id === id,
        );
        if (workspace) return workspace;

        workspace = workspaces.body.workspaces.guestWorkspaces?.find(
            (ws) => ws.workspace_id === id,
        );

        return workspace;
    }

    /**
     * Получение доски по её id
     * @param {Number} id - id доски
     * @returns {Object} - объект доски
     */
    getBoardById(id) {
        const boards = this.storage.get(this.workspaceModel.boards);
        const board = boards.find((brd) => brd.board_id === id);
        return board;
    }

    /**
     * Получение массива досок рабочего пространства
     * @param {Number} id - id рабочего пространства
     * @returns {Array} - массив досок
     */
    getWorkspaceBoards(id) {
        let workspaceBoards = this.storage
            .get(this.workspaceModel.body)
            .body.workspaces.yourWorkspaces.find((ws) => ws.workspace_id === id)?.boards;

        if (!workspaceBoards) {
            workspaceBoards = this.storage
                .get(this.workspaceModel.body)
                .body.workspaces.guestWorkspaces.find((ws) => ws.workspace_id === id).boards;
        }

        return [...workspaceBoards];
    }

    /**
     * Получение массива списков карточек
     * @param {Number} id  id доски
     * @returns {Array}  массив списков
     */
    getBoardLists() {
        const lists = this.storage
            .get(this.workspaceModel.lists)
            .sort((x, y) => x.list_position - y.list_position);
        return [...lists];
    }

    /**
     * Получение списка карточек по его id
     * @param {Number} id - id списка
     * @returns {Object} - объект списка
     */
    getListById(id) {
        return this.storage.get(this.workspaceModel.lists).find((lst) => lst.id === id);
    }

    /**
     * Получение массива карточек у списка
     * @param {Number} id - id списка
     * @returns {Array} - массив карточек
     */
    getListCards(id) {
        const cards = this.storage
            .get(this.workspaceModel.cards)
            .filter((card) => card.list_id === id)
            .sort((x, y) => x.list_position - y.list_position);

        return [...cards];
    }

    /**
     * Получение пользователей на доске
     * @param {Number} id - id доски
     * @returns {Array} - массив пользователей
     */
    getBoardUsers() {
        return [...this.storage.get(this.workspaceModel.users)];
    }

    /**
     * Получение юзеров, находящихся на карточке
     * @param {Number} id - id карточки
     * @returns
     */
    getCardUsers(id) {
        const currentCardUserIds = this.storage
            .get(this.workspaceModel.cards)
            .find((crd) => crd.id === id).users;

        const cardUsers = this.storage
            .get(this.workspaceModel.users)
            .filter((usr) =>
                currentCardUserIds.find((uid) => parseInt(uid, 10) === parseInt(usr.user_id, 10)),
            );

        return [...cardUsers];
    }

    /**
     * Получение карточки по id
     * @param {Number} id - id карточки
     * @returns {Object}
     */
    getCardById(id) {
        const card = this.storage.get(this.workspaceModel.cards).find((crd) => crd.id === id);
        return card;
    }

    /**
     * Получение юзера по id
     * @param {Number} id - id юзера
     * @returns {Object}
     */
    getUserById(id) {
        const user = this.storage.get(this.workspaceModel.users).find((usr) => usr.user_id === id);
        return user;
    }

    /**
     * Получение комментов карточки
     * @param {Number} id - id карточки
     * @returns {Array}
     */
    getCardComments(id) {
        const commIDs = this.storage
            .get(this.workspaceModel.cards)
            .find((crd) => parseInt(crd.id, 10) === parseInt(id, 10)).comments;

        const comms = this.storage
            .get(this.workspaceModel.comments)
            .filter((cmt) => commIDs.find((comid) => parseInt(comid, 10) === parseInt(cmt.id, 10)));

        return comms;
    }

    /**
     * Получение чеклистов карточки
     * @param {Number} id - id карточки
     * @returns {Array}
     */
    getCardChecklists(id) {
        const checklistIDs = this.storage
            .get(this.workspaceModel.cards)
            .find((crd) => crd.id === id).checklists;

        const checklists = this.storage
            .get(this.workspaceModel.checklists)
            .filter((chk) =>
                checklistIDs.find((chid) => parseInt(chid, 10) === parseInt(chk.id, 10)),
            );

        return checklists.sort((x, y) => x.list_position < y.list_position);
    }

    /**
     * Получение пунктов чеклиста
     * @param {Number} id - id чеклиста
     * @returns
     */
    getChecklistItems(id) {
        const itemsIDs = this.storage
            .get(this.workspaceModel.checklists)
            .find((ch) => ch.id === id).items;
        const items = this.storage
            .get(this.workspaceModel.items)
            .filter((chk) => itemsIDs.find((itm) => parseInt(itm, 10) === parseInt(chk.id, 10)));

        return items.sort((x, y) => x.list_position - y.list_position);
    }

    /**
     * Получение пункта чеклиста по его id
     * @param {Number} id - id пункта чеклиста
     * @returns {Object}
     */
    getChecklistItemById(id) {
        const checklistItems = this.storage.get(this.workspaceModel.items);

        const item = checklistItems.find((ch) => ch.id === id);

        return item;
    }

    /**
     * Получение чеклиста по id
     * @param {Number} id - id чеклиста
     * @returns {Object}
     */
    getChecklistById(id) {
        const checklists = this.storage.get(this.workspaceModel.checklists);

        const checklist = checklists.find((ch) => ch.id === id);

        return checklist;
    }

    /**
     * Поиск по подстроке
     * @param {String} substring - подстрока для поиска
     * @returns {Array}
     */
    searchUsers(substring) {
        return this.storage
            .get(this.workspaceModel.users)
            .filter((usr) => usr.email.indexOf(substring) !== -1);
    }

    /**
     * Поиск юзера по почте
     * @param {String} email - почта юзера
     * @returns {Object}
     */
    getUserByEmail(email) {
        return this.storage.get(this.workspaceModel.users).find((usr) => usr.email === email);
    }

    /**
     * Находится ли юзер в доске
     * @param {String} email - почта изера
     * @returns
     */
    checkUserInBoard(email) {
        return !!this.storage.get(this.workspaceModel.users).find((usr) => usr.email === email);
    }

    /**
     * Проверка является ли юзер владельцем доски
     * @param {Number} id - id юзера
     * @returns
     */
    isOwner(userId, boardId) {
        const board = this.getBoardById(parseInt(boardId, 10));
        return board.owner_id === userId;
    }

    /**
     * Проверка есть ли юзер в карточке
     * @param {Number} cardId - айди карточки
     * @param {Number} userId - айди юзера
     * @returns {boolean}
     */
    isUserInCard(cardId, userId) {
        const cardUsers = this.getCardUsers(cardId);
        return !!cardUsers.find((usr) => usr.user_id === userId);
    }

    /**
     * Получение заданий карточки
     * @param {Number} id - id карточки
     * @returns {Array}
     */
    getCardFilesById(id) {
        return this.storage.get(this.workspaceModel.files).filter((f) => f.task_id === id);
    }

    getBoardHistory() {
        return this.storage.get(this.workspaceModel.history);
    }

    filterCardsByTag(name) {
        const id = `${this.getTagOnBoard(name).id}`;
        const cards = this.storage
            .get(this.workspaceModel.cards)
            .filter((c) => c.tags.includes(id));

        let lists = structuredClone(this.storage.get(this.workspaceModel.lists)).map((l) => {
            l.cards = cards
                .filter((c) => c.list_id === l.id)
                .sort((a, b) => a.list_position - b.list_position);
            return l;
        });

        lists = lists.filter((l) => l.cards.length > 0);

        return lists.sort((a, b) => a.list_position - b.list_position);
    }

    getCardTags(id) {
        const tagIds = this.storage
            .get(this.workspaceModel.cards)
            .find((c) => c.id === id)
            .tags?.map((i) => parseInt(i, 10));

        if (!tagIds) {
            return [];
        }

        const tags = this.storage
            .get(this.workspaceModel.tags)
            .filter((t) => tagIds.includes(t.id));
        return [...tags].sort((first, second) => parseInt(first.id, 10) < parseInt(second.id, 10));
    }

    getTagOnBoard(name) {
        return this.storage.get(this.workspaceModel.tags).find((t) => t.name === name);
    }

    getTagById(id) {
        return this.storage.get(this.workspaceModel.tags).find((t) => t.id === id);
    }
}

const workspaceStorage = new WorkspaceStorage();

export default workspaceStorage;
