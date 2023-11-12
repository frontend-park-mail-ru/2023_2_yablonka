import Component from '../../core/basicComponent.js';
import Workspace from '../workspace/workspace.js';
import Board from '../SubComponents/board/board.js';
import template from './userWorkspaces.hbs';

/**
 * Контейнер для досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class UserWorkspaces extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        const userWorkspaces = this.#getWorkspaces(this.config.yourWorkspaces);
        const guestWorkspaces = this.#getWorkspaces(this.config.guestWorkspaces);

        this.parent.insertAdjacentHTML('beforeend', template({ userWorkspaces, guestWorkspaces }));
    }

    #getWorkspaces(workspacesData) {
        const workspaces = [];
        return workspacesData.forEach((workspace) => {
            workspaces.push(
                new Workspace({
                    name: workspace.workspace_name,
                    workspaceId: workspace.workspace_id,
                    boards: this.#getBoards(workspace.boards ? workspace.boards : []),
                }),
            );
        });
    }

    #getBoards(boardsData, workspaceId) {
        const boards = [];
        return boardsData.forEach((board) => {
            boards.push(
                new Board({
                    workspaceId,
                    boardId: board.id,
                    boardName: board.name,
                    boardImg: board.src,
                }).render(),
            );
        });
    }
}
