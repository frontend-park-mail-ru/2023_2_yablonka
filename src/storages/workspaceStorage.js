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
    };

    /**
     * @constructor
     */
    constructor() {
        super();
        this.storage.set(this.workspaceModel.body, undefined);
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
            body = {};
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

        let body;
        try {
            body = await responsePromise.json();
        } catch (error) {
            body = {};
        }

        const { status } = responsePromise;

        if (status === 200) {
            this.changed = true;
            emitter.trigger('renderWorkspaces');
        } else {
        }
    }

    async deleteWorkspace(id) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}workspace/delete/`,
            'DELETE',
            userStorage.storage.get(userStorage.userModel.csrf),
            { workspace_id: id },
        );

        const { status } = responsePromise;

        if (status === 200) {
            this.changed = true;
            let workspaces = this.storage.get(this.workspaceModel.body);
            const indexToDelete = workspaces.workspaces.yourWorkspaces.findIndex(
                (ws) => ws.workspace_id === id,
            );
            if (indexToDelete !== -1) {
                workspaces.workspaces.yourWorkspaces.splice(indexToDelete, 1);
                this.storage.set(this.workspaceModel.body, workspaces);
            }
        } else {
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
            let workspaces = this.storage.get(this.workspaceModel.body);
            const idToChange = newWorkspace.workspace_id;
            const indexToDelete = workspaces.workspaces.yourWorkspaces.forEach((ws) => {
                if (ws.workspace_id === idToChange) {
                    ws.name = newWorkspace.workspace_name;
                    ws.description = newWorkspace.workspace_description;
                }
            });
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

        const { status } = responsePromise;

        if (status === 200) {
            let oldWorkspaces = this.storage.get(this.workspaceModel.body);
            oldWorkspaces.body.workspaces.forEach((ws) => {
                ws.boards.forEach((brd) => {
                    if (brd.board_id === board.id) {
                        brd = body.board;
                    }
                });
            });
            this.storage.set(this.workspaceModel.body, oldWorkspaces);
            emitter.trigger('renderWorkspaces');
        } else {
        }
    }

    async createBoard(board) {
        board.owner_id = userStorage.storage.get(userStorage.userModel.body).body.user.user_id;
        board.email = userStorage.storage.get(userStorage.userModel.body).body.user.email;

        const responsePromise = await AJAX(
            `${apiPath + apiVersion}board/create/`,
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
            let oldWorkspaces = this.storage.get(this.workspaceModel.body);
            oldWorkspaces.body.workspaces.forEach((ws) => {
                ws.boards.forEach((brd) => {
                    if (brd.board_id === board.id) {
                        brd = body.board;
                    }
                });
            });
            this.storage.set(this.workspaceModel.body, oldWorkspaces);
            emitter.trigger('renderWorkspaces');
        } else {
        }
    }
}

const workspaceStorage = new WorkspaceStorage();

export default workspaceStorage;
