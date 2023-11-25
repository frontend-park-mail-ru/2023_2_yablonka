import BaseStorage from './baseStorage.js';
import AJAX from '../modules/ajax.js';
import { apiPath, apiVersion } from '../configs/configs.js';
import userStorage from './userStorage.js';
import emitter from '../modules/actionTrigger.js';

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
            console.log(error, responsePromise);
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
        } else {
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
            this.addBoard(body.body.board);
            this.addLists(body.body.lists);
            this.addCards(body.body.cards);
        } else {
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
        } else {
        }
    }

    async deleteBoard(board) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}board/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            board,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        } else {
        }
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
        } else {
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
        } else {
        }
    }

    async updateList(list) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}list/update/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            list,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        } else {
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
        } else {
        }
    }

    async createCard(card) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}card/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            card,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        } else {
        }
    }

    async updateCard(card) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}card/update/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            card,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        } else {
        }
    }

    async deleteCard(card) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}card/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            card,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
        } else {
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
            emitter.trigger('rerender');
        } else {
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
            emitter.trigger('rerender');
        } else {
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

    addLists(lists) {
        const lsts = this.storage.get(this.workspaceModel.lists);
        if (!lsts.length) {
            lists.forEach((l) => {
                lsts.push(l);
            });
            this.storage.set(this.workspaceModel.lists, lsts);
            return;
        }

        lists.forEach((lst) => {
            lsts.forEach((l) => {
                if (l.id === lst.id) {
                    l = lst;
                }
            });
        });
    }

    addCards(cards) {
        const crds = this.storage.get(this.workspaceModel.cards);
        if (!crds.length) {
            cards.forEach((c) => {
                crds.push(c);
            });
            this.storage.set(this.workspaceModel.lists, cards);
            return;
        }

        cards.forEach((crd) => {
            crds.forEach((c) => {
                if (c.id === crd.id) {
                    c = crd;
                }
            });
        });
    }

    /**
     * Получение workspace по его id
     * @param {Number} id - id рабочего пространства
     * @returns {Object} - объект рабочего пространства
     */
    getWorkspaceById(id) {
        const workspaces = this.storage.get(this.workspaceModel.body);
        let workspace = workspaces.body.workspaces.yourWorkspaces.find(
            (ws) => ws.workspace_id === id,
        );
        if (workspace) return workspace;

        workspace = workspaces.body.workspaces.guestWorkspaces.find((ws) => ws.workspace_id === id);

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
            .body.workspaces.yourWorkspaces.find((ws) => ws.workspace_id === id).boards;

        if (!workspaceBoards) {
            workspaceBoards = this.storage
                .get(this.workspaceModel.body)
                .body.workspaces.guestWorkspaces.find((ws) => ws.workspace_id === id).boards;
        }

        return [...workspaceBoards];
    }

    /**
     * Получение массива списков карточек
     * @param {Number} id - id доски
     * @returns {Array} - массив списков
     */
    getBoardLists(id) {
        const boardLists = this.storage
            .get(this.workspaceModel.boards)
            .find((brd) => brd.board_id === id)?.lists;

        const lists = [];
        this.storage.get(this.workspaceModel.lists).forEach((lst) => {
            if (boardLists.find((l) => l === lst.id)) {
                lists.push(lst);
            }
        });

        return [...lists];
    }

    /**
     * Получение массива карточек у списка
     * @param {Number} id - id списка
     * @returns {Array} - массив карточек
     */
    getListCards(id) {
        const listCards = this.storage
            .get(this.workspaceModel.lists)
            .find((lst) => lst.id === id).cards;

        const cards = [];
        this.storage.get(this.workspaceModel.cards).forEach((crd) => {
            if (listCards.find((c) => c === crd.id)) {
                cards.push(crd);
            }
        });

        return [...cards];
    }

    /**
     * Получение пользователей на доске
     * @param {Number} id - id доски
     * @returns {Array} - массив пользователей
     */
    getBoardUsers(id) {
        const users = this.storage
            .get(this.workspaceModel.boards)
            .find((brd) => brd.board_id === id).users;

        return [...users];
    }
}

const workspaceStorage = new WorkspaceStorage();

export default workspaceStorage;
