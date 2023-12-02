import BaseStorage from './baseStorage.js';
import AJAX from '../modules/ajax.js';
import { apiPath, apiVersion } from '../configs/configs.js';
import userStorage from './userStorage.js';
import emitter from '../modules/actionTrigger.js';
import NotificationMessage from '../components/Common/notification/notificationMessage.js';
import popupEvent from '../components/core/popeventProcessing.js';
import Card from '../components/Card/card.js';
import AddChecklist from '../components/Card/popups/addChecklist/addChecklist.js';

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
            console.log(body);
            this.addBoard(body.body.board);
            this.storage.set(this.workspaceModel.lists, body.body.lists);
            this.storage.set(this.workspaceModel.cards, body.body.cards);
            this.storage.set(this.workspaceModel.users, body.body.users);
            this.storage.set(this.workspaceModel.comments, body.body.comments);
            this.storage.set(this.workspaceModel.checklists, body.body.checklists);
            this.storage.set(this.workspaceModel.items, body.body.checklist_items);
        } else if (status === 403) {
            emitter.trigger('noaccess');
        }
    }

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

    async deleteBoard(board) {
        await AJAX(
            `${apiPath + apiVersion}board/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            board,
        );
    }

    async updateBoard(board) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}board/update/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            board,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        }
    }

    async createList(list) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}list/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            list,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        }
    }

    async updateList(list) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}list/edit/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            list,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        }
    }

    async deleteList(list) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}list/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            list,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        }
    }

    async createCard(card) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}task/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            card,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        }
    }

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
            }
        }
    }

    async deleteCard(card) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}task/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            card,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        }
    }

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

    async deleteChecklist(checklist) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}checklist/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            checklist,
        );

        const { status } = responsePromise;
        let body;

        if (status === 200) {
            const boardChecklists = this.storage.get(this.workspaceModel.checklists);
            const cardChecklists = this.getCardById(parseInt(checklist.task_id, 10)).checklists;

            body = await responsePromise.json();
            const boardChecklistInd = boardChecklists.findInex(
                (checklistElement) =>
                    parseInt(checklistElement.id, 10) === parseInt(checklist.id, 10),
            );
            boardChecklists.splice(boardChecklistInd, boardChecklistInd + 1);

            const cardChecklistInd = boardChecklists.findInex(
                (checklistId) => parseInt(checklistId, 10) === body.body.checklist,
            );
            cardChecklists.sort((f, s) => parseInt(f.id, 10) < parseInt(s.id, 10));

            AddChecklist.deleteChecklist(body.body.checklist);
        }
    }

    async createChecklistItem(checklistItem) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}checklist/item/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            checklistItem,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        }
    }

    async updateChecklistItem(checklistItem) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}checklist/item/edit/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            checklistItem,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        }
    }

    async deleteChecklistItem(checklistItem) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}checklist/item/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            checklistItem,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        }
    }

    async commentCard(comment) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}comment/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            comment,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        }
    }

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

            currentCardUserIds.splice(ind, ind + 1);

            Card.updateUsers(parseInt(data.task_id, 10));
        }
    }

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
            .sort((x, y) => x.list_position > y.list_position);
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
            .sort((x, y) => x.list_position > y.list_position);

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

    getCardUsers(id) {
        const currentCardUserIds = this.storage
            .get(this.workspaceModel.cards)
            .find((crd) => crd.id === id).users;

        const cardUsers = this.storage
            .get(this.workspaceModel.users)
            .filter((usr) => currentCardUserIds.find((uid) => uid == usr.user_id));

        return [...cardUsers];
    }

    getCardById(id) {
        const crd = this.storage.get(this.workspaceModel.cards).find((crd) => crd.id === id);
        return crd;
    }

    getUserById(id) {
        const usr = this.storage.get(this.workspaceModel.users).find((usr) => usr.user_id === id);
        return usr;
    }

    getCardComments(id) {
        const commIDs = this.storage
            .get(this.workspaceModel.cards)
            .find((crd) => crd.id == id).comments;

        const comms = this.storage
            .get(this.workspaceModel.comments)
            .filter((cmt) => commIDs.find((comid) => comid == cmt.id));

        return comms;
    }

    getCardChecklists(id) {
        const checklistIDs = this.storage
            .get(this.workspaceModel.cards)
            .find((crd) => crd.id === id).checklists;

        const checklists = this.storage
            .get(this.workspaceModel.checklists)
            .filter((chk) => checklistIDs.find((chid) => chid == chk.id));

        return checklists.sort((x, y) => x.list_position < y.list_position);
    }

    getChecklistItems(id) {
        const itemsIDs = this.storage
            .get(this.workspaceModel.checklists)
            .find((ch) => ch.id === id).items;
        const items = this.storage
            .get(this.workspaceModel.items)
            .filter((chk) => itemsIDs.find((itm) => itm == chk.id));

        return items.sort((x, y) => x.list_position < y.list_position);
    }

    searchUsers(substring) {
        return this.storage
            .get(this.workspaceModel.users)
            .filter((usr) => usr.email.indexOf(substring) !== -1);
    }

    getUserByEmail(email) {
        return this.storage.get(this.workspaceModel.users).find((usr) => usr.email === email);
    }

    checkUserInBoard(email) {
        return !!this.storage.get(this.workspaceModel.users).find((usr) => usr.email === email);
    }

    isOwner(id) {
        return this.storage.get(this.workspaceModel.boards)[0].owner_id === id;
    }

    isUserInCard(cardId, userId) {
        const cardUsers = this.getCardUsers(cardId);
        return !!cardUsers.find((usr) => usr.user_id === userId);
    }
}

const workspaceStorage = new WorkspaceStorage();

export default workspaceStorage;
