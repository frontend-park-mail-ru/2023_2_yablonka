import Header from '../components/Common/header/header.js';
import PageLayout from '../components/pageLayout/pageLayout.js';
import ContainerBoard from '../components/Board/containerBoard/containerBoard.js';
import BoardSidebar from '../components/Board/boardSidebar/boardSidebar.js';
import BoardLocation from '../components/Board/board/boardLocation.js';
import BoardMenu from '../components/Board/boardMenu/boardMenu.js';
import NavigationPopup from '../components/popups/navigation/navigation.js';
import { actionRedirect, actionLogout, actionNavigate } from '../actions/userActions.js';
import { actionGetBoards } from '../actions/workspaceActions.js';
import userStorage from '../storages/userStorage.js';
import emitter from '../modules/actionTrigger.js';
import dispatcher from '../modules/dispatcher.js';
import workspaceStorage from '../storages/workspaceStorage.js';

/**
 * Класс для рендера страницы доски
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
class Board {
    #root;

    workspaceID;

    boardID;

    cardID;

    /**
     * @constructor
     */
    constructor() {
        this.#root = document.querySelector('.page');
    }

    workSpaceConfig = {
        yourWorkspaces: [
            {
                workspace_id: 1,
                workspace_name: 'Best Workspace',
                thumbnail_url: '',
                boards: [
                    {
                        board_id: 1,
                        board_name: 'Good board',
                        description: 'Just board',
                        lists: [
                            {
                                description: 'Just list',
                                id: 1,
                                list_position: 0,
                                name: 'Список1',
                                cards: [
                                    {
                                        description: 'Description',
                                        id: 0,
                                        name: 'Card',
                                        users: [
                                            {
                                                avatar_url: 'avatar.jpg',
                                                email: 'test1@email.ru',
                                                name: 'BBB',
                                                surname: 'ccc',
                                                user_id: 10,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                        users: [
                            {
                                avatar_url: 'avatar.jpg',
                                email: 'test1@email.ru',
                                name: 'BBB',
                                surname: 'ccc',
                                user_id: 10,
                            },
                        ],
                    },
                ],
            },
        ],
        guestWorkspace: [],
    };

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        const [w, wsID, b, bID, c, cID] = window.location.pathname.shift().split('_');

        console.log(wsID, bID, cID);

        this.workspaceID = wsID;
        this.boardID = bID;
        this.cardID = cID;

        const user = userStorage.storage.get(userStorage.userModel.body);

        const currentWorkspace = workspaceStorage.storage
            .get(workspaceStorage.workspaceModel.body)
            .find((ws) => ws.id === this.workspaceID);

        const currentBoard = currentWorkspace.boards.find((board) => board.id === this.boardID);

        const pageLayout = new PageLayout(this.#root, { className: 'board' });
        pageLayout.render();
        const header = new Header(this.#root.querySelector(pageLayout.className), {
            user: { avatar: user.body.user.thumbnail_url },
        });
        header.render();
        new ContainerBoard(this.#root).render();
    }

    async renderWorkspace() {
        const containerBoard = document.querySelector('.container-board');

        const currentWorkspace = workspaceStorage.storage
            .get(workspaceStorage.workspaceModel.body)
            .find((ws) => ws.id === this.workspaceID);

        new BoardSidebar(containerBoard, {
            userAvatar: userStorage.storage.get(userStorage.userModel.body).thumbnail_url,
            workspaceName: currentWorkspace.name,
            boards: currentWorkspace.boards,
        }).render();

        new BoardLocation(containerBoard, {}).render();
    }

    async renderBoard() {
        const boardContainer = this.#root.querySelector('.board');

        const currentWorkspace = workspaceStorage.storage
            .get(workspaceStorage.workspaceModel.body)
            .find((ws) => ws.id === this.workspaceID);

        const currentBoard = currentWorkspace.boards.find((board) => board.id === this.boardID);

        new BoardMenu(boardContainer, { boardName: currentBoard.name }).render();
    }
}

const board = new Board();

export default board;
