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

        const { status } = responsePromise; // дописать
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
            `${apiPath + apiVersion}list/update/`,
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
            `${apiPath + apiVersion}card/create/`,
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
            `${apiPath + apiVersion}card/update/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            card,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
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
        const lsts = [];
        lists.forEach((l) => {
            lsts.push(l);
        });
        this.storage.set(this.workspaceModel.lists, lsts);
        return;
    }

    addCards(cards) {
        const crds = [];
        cards.forEach((c) => {
            crds.push(c);
        });
        this.storage.set(this.workspaceModel.lists, crds);
        return;
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
        const lists = [
            { id: 1, board_id: 18, name: 'list1', description: '', list_position: 0, cards: [3] },
            { id: 2, board_id: 19, name: 'list2', description: '', list_position: 1, cards: [1] },
            { id: 3, board_id: 19, name: 'лист 1', description: '', list_position: 2, cards: [2] },
        ];
        // const boardLists = this.storage
        //     .get(this.workspaceModel.boards)
        //     .find((brd) => brd.board_id === id)?.lists;

        // const lists = [];
        // lists = this.storage.get(this.workspaceModel.lists).filter(lst=>list.board_id===id);

        return [...lists];
    }

    /**
     * Получение массива карточек у списка
     * @param {Number} id - id списка
     * @returns {Array} - массив карточек
     */
    getListCards(id) {
        const cards = [
            {
                id: 1,
                list_id: 3,
                date_created: '2023-11-25T01:10:36.436655Z',
                name: 'task1',
                description: 'some dsc',
                list_position: 1,
                start: null,
                end: null,
                users: null,
                checklists: null,
                comments: null,
            },
            {
                id: 2,
                list_id: 2,
                date_created: '2023-11-25T01:10:36.436655Z',
                name: 'Задача 2',
                description: '',
                list_position: 3,
                start: null,
                end: null,
                users: null,
                checklists: null,
                comments: null,
            },
            {
                id: 3,
                list_id: 1,
                date_created: '2023-11-25T01:10:36.436655Z',
                name: 'TASача',
                description: 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
                list_position: 2,
                start: null,
                end: null,
                users: null,
                checklists: null,
                comments: null,
            },
        ];
        // const listCards = this.storage
        //     .get(this.workspaceModel.lists)
        //     .find((lst) => lst.id === id).cards;

        // const cards = [];
        // lists = this.storage.get(this.workspaceModel.cards).filter(card=>card.id===id);

        return [...cards];
    }

    /**
     * Получение пользователей на доске
     * @param {Number} id - id доски
     * @returns {Array} - массив пользователей
     */
    getBoardUsers(id) {
        const { users } = this.storage
            .get(this.workspaceModel.boards)
            .find((brd) => brd.board_id === id);

        return [...users];
    }
}

const workspaceStorage = new WorkspaceStorage();

export default workspaceStorage;
