// base view
import BaseView from './baseView.js';
// components
import MainPage from '../pages/Main/main.js';
import Navigation from '../components/popups/navigation/navigation.js';
import CreateWorkspace from '../components/popups/createWorkspace/createWorkspace.js';
import WorkspaceSettings from '../components/popups/workspaceSettings/workspaceSettings.js';
import CreateBoard from '../components/popups/createBoard/createBoard.js';
// actions
import { actionGetWorkspaces } from '../actions/workspaceActions.js';
import { actionGetBoard } from '../actions/boardActions.js';
// storages
import userStorage from '../storages/userStorage.js';
import workspaceStorage from '../storages/workspaceStorage.js';
// routing
import dispatcher from '../modules/dispatcher.js';
import emitter from '../modules/actionTrigger.js';
import IFrame from '../components/atomic/iframe/iframe.js';

/**
 * Класс для рендера страницы досок
 * @class
 */
class Main extends BaseView {
    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        document.title = 'Tabula: Ваши Доски';

        const factor = Math.floor(Math.random() * 100) + 1;

        const { user } = userStorage.storage.get(userStorage.userModel.body).body;

        await dispatcher.dispatch(actionGetWorkspaces());
        console.log(1);

        const { workspaces } = workspaceStorage.storage.get(
            workspaceStorage.workspaceModel.body,
        ).body;

        this.components.push(new MainPage(this.root, { user, workspaces }));

        if (factor === 100 && !userStorage.storage.get(userStorage.userModel.isShown)) {
            this.components.push(
                new IFrame(this.root, {
                    url: `${window.location.origin}/questionnaire`,
                    id: 'questionner-iframe',
                }),
            );
            userStorage.storage.set(userStorage.userModel.isShown, true);
        }

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
    }

    reRender() {
        this.clear();
        this.renderPage();
    }
}

const main = new Main();

export default main;
