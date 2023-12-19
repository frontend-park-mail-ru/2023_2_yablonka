import workspaceStorage from '../../../storages/workspaceStorage';
import WorkspaceBoard from './atomic/workspaceBoard/workspaceBoard';
import Component from '../../core/basicComponent';
import template from './sidebar.hbs';
import './sidebar.scss';
import userStorage from '../../../storages/userStorage';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Sidebar extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            workspaceID: this.config.workspace_id,
            workspaceIcon: Array.from(this.config.workspaceName)[0],
            workspaceName: this.config.workspaceName,
            boards: this.#getWorkspaceBoards(this.config.workspace_id),
            isOwner: this.config.is_owner,
        });
    }

    #getWorkspaceBoards(workspaceID) {
        const workspaceBoards = [];
        const boards = workspaceStorage.getWorkspaceBoards(workspaceID);
        boards.forEach((board) => {
            workspaceBoards.push(
                new WorkspaceBoard(null, { workspace_id: workspaceID, ...board }).render(),
            );
        });
        return workspaceBoards;
    }
}
