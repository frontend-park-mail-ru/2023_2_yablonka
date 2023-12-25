import Component from '../../core/basicComponent.js';
import Workspace from '../workspace/workspace.js';
import Board from '../atomic/board/board.js';
import template from './userWorkspaces.hbs';
import './userWorkspaces.scss';

/**
 * Компонент рабочих пространств
 * @class
 */
export default class UserWorkspaces extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        const userWorkspaces = this.#getWorkspaces(
            this.config?.yourWorkspaces ? this.config.yourWorkspaces : [],
            true,
        );
        return template({ userWorkspaces });
    }

    /**
     * Функция для получения отредеренного массива рабочих пространств
     * @param {string} inputsData - данные input для рендера поля формы
     * @param {Boolean} owner - является ли пользователь вдадельцем рабочего пространства
     * @return {array} workspaces - массив с отрендеренными компонентами рабочих пространств
     */
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

    /**
     * Функция для получения отредеренного массива досок рабочего пространства
     * @param {string} boardsData - данные board для рендера компоненты доски
     * @param {Number} workspaceId - id рабочего пространства, для которого рендерятся доски
     * @return {array} boards - массив с отрендеренными компонентами досок рабочего пространства
     */
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
