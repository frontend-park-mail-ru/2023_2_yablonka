import Component from '../../core/basicComponent.js';
import Workspace from '../workspace/workspace.js';
import Board from '../atomic/board/board.js';
import template from './guestWorkspaces.hbs';

/**
 * Контейнер для досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class GuestWorkspaces extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        const guestWorkspaces = this.#getWorkspaces(
            this.config.guestWorkspaces ? this.config.guestWorkspaces : [],
            false,
        );
        return template({ guestWorkspaces });
    }

    #getWorkspaces(workspacesData, owner) {
        const workspaces = [];
        workspacesData.forEach((workspace) => {
            workspaces.push(
                new Workspace(null, {
                    workspaceId: workspace.workspace_id,
                    isOwner: owner,
                    workspaceName: workspace.workspace_name,
                    boards: this.#getBoards(
                        workspace.boards ? workspace.boards : [],
                        workspace.workspace_id,
                    ),
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
                    boardImg: board.thumbnail_url ? board.thumbnail_url : 'main_theme.jpg',
                }).render(),
            );
        });
        return boards;
    }
}
