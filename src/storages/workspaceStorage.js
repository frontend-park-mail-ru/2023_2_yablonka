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
        users: 'users',
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

        console.log(body);

        const { status } = responsePromise;

        if (status === 200) {
            this.addBoard(body.body.board);
            this.storage.set(this.workspaceModel.lists, body.body.lists);
            this.storage.set(this.workspaceModel.cards, body.body.cards);
            this.storage.set(this.workspaceModel.users, body.body.users);
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
            emitter.trigger('rerender');
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

    async commentCard(comment) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}comment/create/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            comment,
        );
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
        // const cards = [
        //     {
        //         id: 1,
        //         list_id: 3,
        //         date_created: '2023-11-25T01:10:36.436655Z',
        //         name: 'task1',
        //         description: 'some dsc',
        //         list_position: 1,
        //         start: null,
        //         end: null,
        //         users: null,
        //         checklists: null,
        //         comments: null,
        //     },
        //     {
        //         id: 2,
        //         list_id: 2,
        //         date_created: '2023-11-25T01:10:36.436655Z',
        //         name: 'Задача 2',
        //         description: '',
        //         list_position: 3,
        //         start: null,
        //         end: null,
        //         users: null,
        //         checklists: null,
        //         comments: null,
        //     },
        //     {
        //         id: 3,
        //         list_id: 1,
        //         date_created: '2023-11-25T01:10:36.436655Z',
        //         name: 'TASача',
        //         description: 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
        //         list_position: 2,
        //         start: null,
        //         end: null,
        //         users: null,
        //         checklists: null,
        //         comments: null,
        //     },
        // ];

        const cards = this.storage
            .get(this.workspaceModel.cards)
            .filter((card) => card.list_id === id)
            .sort((x, y) => x.list_position > y.list_position);

        return [...cards];
    }

    getCardById(id) {
        return this.storage.get(this.workspaceModel.cards).find((card) => card.id === id);
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
        const cardUsers = [];
        // const currentCardUserIds = this.storage
        //     .get(this.workspaceModel.cards)
        //     .find((crd) => crd.id === id).users;

        // const cardUsers = this.storage
        //     .get(this.workspaceModel.users)
        //     .filter((usr) => currentCardUserIds.includes(usr.user_id));

        return [...cardUsers];
    }

    getCardById(id) {
        console.log(this.storage.get(this.workspaceModel.cards));
        return this.storage.get(this.workspaceModel.cards).find((crd) => crd.id === id);
    }

    getUserById(id) {
        return this.storage.get(this.workspaceModel.users).find(usr => usr.user_id === id);
    }
}

const workspaceStorage = new WorkspaceStorage();

export default workspaceStorage;
