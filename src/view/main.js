// base view
import BaseView from './baseView.js';
// components
import MainPage from '../pages/Main/main.js';
import Navigation from '../components/popups/navigation/navigation.js';
import CreateWorkspace from '../components/popups/createWorkspace/createWorkspace.js';
// actions
import { actionGetWorkspaces } from '../actions/workspaceActions.js';
import { actionGetBoard } from '../actions/boardActions.js';
// storages
import userStorage from '../storages/userStorage.js';
import workspaceStorage from '../storages/workspaceStorage.js';
// routing
import dispatcher from '../modules/dispatcher.js';

import emitter from '../modules/actionTrigger.js';
import WorkspaceSettings from '../components/popups/workspaceSettings/workspaceSettings.js';
import CreateBoard from '../components/popups/createBoard/createBoard.js';

/**
 * Класс для рендера страницы досок
 * @class
 */
class Boards extends BaseView {
    constructor() {
        super();
        emitter.bind('renderWorkspaces', this.reRender.bind(this));
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        document.title = 'Tabula: Ваши Доски';

        const { user } = userStorage.storage.get(userStorage.userModel.body).body;

        await dispatcher.dispatch(actionGetWorkspaces());

        const { workspaces } = workspaceStorage.storage.get(
            workspaceStorage.workspaceModel.body,
        ).body;

        this.components.push(new MainPage(this.root, { user, workspaces }));

        this.components.push(
            ...[
                new Navigation(this.root, user),
                new CreateWorkspace(this.root, {}),
                new WorkspaceSettings(this.root, {}),
                new CreateBoard(this.root, {}),
            ],
        );

        this.render();
        this.addListeners();

        await dispatcher.dispatch(actionGetBoard(22));
    }

    async reRender() {
        this.clear();
        this.renderPage();
    }
}

const main = new Boards();

export default main;
