import Component from '../../core/basicComponent.js';
import Workspace from '../workspace/workspace.js';
import Board from '../SubComponents/board/board.js';
import template from './userWorkspaces.hbs';
import './userWorkspaces.scss';

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
        const userWorkspaces = this.#getWorkspaces(
            this.config.yourWorkspaces ? this.config.yourWorkspaces : [],
        );
        const guestWorkspaces = this.#getWorkspaces(
            this.config.guestWorkspaces ? this.config.guestWorkspaces : [],
        );

        this.parent.insertAdjacentHTML('beforeend', template({ userWorkspaces, guestWorkspaces }));
    }

    #getWorkspaces(workspacesData) {
        const workspaces = [];
        workspacesData.forEach((workspace) => {
            workspaces.push(
                new Workspace(null, {
                    workspaceId: workspace.workspace_id,
                    workspaceName: workspace.workspace_name,
                    boards: this.#getBoards(workspace.boards ? workspace.boards : []),
                }).render(),
            );
        });
        return workspaces;
    }

    #getBoards(boardsData, workspaceId) {
        const boards = [];
        boardsData.forEach((board) => {
            boards.push(
                new Board(null, {
                    workspaceId,
                    boardId: board.id,
                    boardName: board.name,
                    boardImg: board.src,
                }).render(),
            );
        });
        return boards;
    }
}
