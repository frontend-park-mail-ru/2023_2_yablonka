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
    };

    /**
     * @constructor
     */
    constructor() {
        super();
        this.storage.set(this.workspaceModel.body, undefined);
        this.storage.set(this.workspaceModel.boards, []);
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

        if (status === 200) {
            this.changed = true;
        }

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
            emitter.trigger('renderWorkspaces');
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
            this.changed = true;
            emitter.trigger('renderWorkspaces');
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

        if (status === 200) {
            this.changed = true;
        } else {
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
            console.log(oldWorkspaces.body.workspaces.yourWorkspaces);

            const idx = this.storage
                .get(this.workspaceModel.boards)
                .findIndex((brd) => brd.board_id === board.board_id);
            let boards = this.storage.get(this.workspaceModel.boards);
            if (idx !== -1) {
                boards.splice(idx, 1);
            }
            boards.push(body.body.board);
            this.storage.set(this.workspaceModel.boards, boards);
            console.log(this.storage.get(this.workspaceModel.body));
            //emitter.trigger('renderWorkspaces');
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

        console.log(await responsePromise.json());

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('renderWorkspaces');
        } else {
        }
    }

    async deleteBoard(board) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}board/delete/`,
            'POST',
            userStorage.storage.get(userStorage.userModel.csrf),
            board,
        );

        console.log(await responsePromise.json());

        const { status } = responsePromise;

        if (status === 200) {
            const idx = this.storage
                .get(this.workspaceModel.boards)
                .findIndex((brd) => brd.board_id === board.id);
            const boards = this.storage.get(this.workspaceModel.boards);
            boards.splice(idx,1);
            this.storage.set(this.workspaceModel.boards, boards);
            //emitter.trigger('renderWorkspaces');
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

        console.log(await responsePromise.json());

        const { status } = responsePromise;

        if (status === 200) {
            let boards = this.storage.get(this.userModel.boards);
            const idx = this.storage
                .get(this.workspaceModel.boards)
                .findIndex((brd) => brd.board_id === board.id);
            boards[idx].name = board.name;
            boards[idx].description = board.description;
            this.storage.set(this.workspaceModel.body, boards);
            //emitter.trigger('renderWorkspaces');
        } else {
        }
    }
}

const workspaceStorage = new WorkspaceStorage();

export default workspaceStorage;
