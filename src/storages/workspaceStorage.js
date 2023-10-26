import BaseStorage from './baseStorage.js';
import AJAX from '../modules/ajax.js';
import { apiPath, apiVersion } from '../configs/configs.js';

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
        const responsePromise = await AJAX(`${apiPath + apiVersion}user/boards/`, 'GET');

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
}

const workspaceStorage = new WorkspaceStorage();

export default workspaceStorage;
