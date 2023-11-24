import workspaceStorage from '../../../storages/workspaceStorage';
import WorkspaceBoard from './atomic/workspaceBoard/workspaceBoard';
import Component from '../../core/basicComponent';
import template from './Sidebar.hbs';
import './Sidebar.scss';

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
            workspaceIcon: Array.prototype(this.config.workspaceName)[0],
            workspaceName: this.config.workspaceName,
            boards: this.#getWorkspaceBoards(this.config.workspace_id),
        });
    }

    #getWorkspaceBoards(workspaceID) {
        const workspaceBoards = [];
        const boards = workspaceStorage.getWorkspaceBoards(workspaceID);
        boards.forEach((user) => {
            workspaceBoards.push(new WorkspaceBoard(null, user).render());
        });
        return workspaceBoards;
    }
}
