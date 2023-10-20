import BaseStorage from './baseStorage.js';
import AJAX from '../modules/ajax.js';
import { apiPath, apiVersion } from '../configs/configs.js';
import emitter from '../modules/eventEmitter.js';

class WorkspaceStorage extends BaseStorage {
    workspaceModel = {
        body: 'body',
        status: 'status',
    };

    constructor() {
        super();
        this.storage.set(this.workspaceModel.body, undefined);
    }

    async getWorkspaces() {
        const responsePromise = await AJAX(`${apiPath + apiVersion}user/boards/`, 'GET');

        const body = responsePromise;
        const { status } = responsePromise;

        if (status === 200) {
            this.changed = true;
        }

        this.storage.set(this.workspaceModel.body, body);

        this.storage.set(this.workspaceModel.status, status);
        emitter.trigger('getDesks');
    }
}

const workspaceStorage = new WorkspaceStorage();

export default workspaceStorage;
