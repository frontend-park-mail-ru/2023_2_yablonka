import Header from '../components/deskComponents/header/header.js';
import Main from '../components/deskComponents/main/main.js';
import Sidebar from '../components/deskComponents/sidebar/sidebar.js';
import AllBoards from '../components/deskComponents/all-boards/all-boards.js';
import ContentHeaderName from '../components/deskComponents/content__header-name/content__header-name.js';
import ButtonCreateWorkspace from '../components/deskComponents/button__create-workspace/button__create-workspace.js';
import ContentBoardsList from '../components/deskComponents/content__boards-list/content__boards-list.js';
import BoardsListItem from '../components/deskComponents/boards-list-item/boards-list-item.js';
import WorkspaceCardDesctiption from '../components/deskComponents/workspace-card__desctiption/workspace-card__desctiption.js';
import BoardTitleLogo from '../components/deskComponents/board-title__logo/board-title__logo.js';
import BoardsLogo from '../components/deskComponents/boards-logo/boards-logo.js';
import WorkspaceMessage from '../components/deskComponents/workspace-message/workspace-message.js';
import { actionRedirect, actionLogout } from '../actions/userActions.js';
import { actionGetBoards } from '../actions/workspaceActions.js';
import userStorage from '../storages/userStorage.js';
import emitter from '../modules/eventEmitter.js';
import dispatcher from '../modules/dispatcher.js';
import workspaceStorage from '../storages/workspaceStorage.js';

/**
 * Класс для рендера страницы досок
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
class Boards {
    #root;

    constructor() {
        this.#root = document.querySelector('.page');
        emitter.bind('logout', this.close);
    }

    yourDesksConfig = {
        contentHeaderName: {
            yours: {
                title: 'ВАШИ РАБОЧИЕ ПРОСТРАНСТВА',
                id: 'yours',
            },
            guest: {
                title: 'ГОСТЕВЫЕ РАБОЧИЕ ПРОСТРАНСТВА',
                id: 'guest',
            },
        },
    };

    /**
     * Рендер досок пользователя
     * @param {Object} usersDesks - данные о досках(не своих), в которых пользователь участвует
     */
    #renderGuestWorspace = (usersDesks) => {
        const guestWorkspace = this.#root.querySelector('#guest');

        if (!usersDesks) {
            const workspaceMessage = new WorkspaceMessage(guestWorkspace, {
                workspace: {
                    message: 'Вы пока что не добавлены ни в одно рабочее пространство.',
                },
            });
            workspaceMessage.render();
            return;
        }

        const contentBoardsList = new ContentBoardsList(guestWorkspace);
        contentBoardsList.render();

        const guestBoards = guestWorkspace.childNodes[0];

        const uniqOwnersId = new Map();
        let userWorkspaceNumber = 0;
        usersDesks.forEach((desk) => {
            if (!uniqOwnersId.has(desk.owner_id)) {
                uniqOwnersId.set(desk.owner_id, userWorkspaceNumber);
                userWorkspaceNumber += 1;

                const boardsListItem = new BoardsListItem(guestBoards);
                boardsListItem.render();

                const boardsImages = guestBoards.childNodes[0];

                const workspaceCardDesctiption = new WorkspaceCardDesctiption(boardsImages, {
                    user: {
                        name: desk.owner_email,
                    },
                });
                workspaceCardDesctiption.render();

                const boardsLogo = new BoardsLogo(boardsImages);
                boardsLogo.render();
            }
            const guestProjects = guestBoards.childNodes[uniqOwnersId.get(desk.owner_id)];
            const boardTitleLogo = new BoardTitleLogo(
                guestProjects.childNodes[guestProjects.childNodes.length - 1],
                {
                    userDeskInform: {
                        name: desk.board_info.board_name,
                        image: desk.board_info.thumbnail_url,
                    },
                },
            );
            boardTitleLogo.render();
        });
    };

    /**
     * Рендер досок пользователя
     * @param {Object} usersDesks - данные о досках авторизованного пользователя
     */
    #renderOwnerWorkspace = (usersDesks) => {
        const yourWorkspace = this.#root.querySelector('#yours');

        if (!usersDesks) {
            const workspaceMessage = new WorkspaceMessage(yourWorkspace, {
                workspace: {
                    message: 'Вы пока что не создали ни одно рабочее пространство.',
                },
            });
            workspaceMessage.render();
            const buttonCreateWorkspace = new ButtonCreateWorkspace(yourWorkspace.childNodes[0]);
            buttonCreateWorkspace.render();
            return;
        }
        const contentBoardsList = new ContentBoardsList(yourWorkspace);
        contentBoardsList.render();

        const yourBoards = yourWorkspace.childNodes[0];

        const boardsListItem = new BoardsListItem(yourBoards);
        boardsListItem.render();

        const boardsImages = yourBoards.childNodes[0];

        const boardsLogo = new BoardsLogo(boardsImages);
        boardsLogo.render();

        usersDesks.forEach((desk) => {
            const boardTitleLogo = new BoardTitleLogo(
                boardsImages.childNodes[boardsImages.childNodes.length - 1],
                {
                    userDeskInform: {
                        name: desk.board_name,
                        image: desk.thumbnail_url,
                    },
                },
            );
            boardTitleLogo.render();
        });
    };

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        this.#root.innerHTML = '';
        this.#root.style.backgroundColor = '';
        document.title = 'Tabula: Ваши Доски';

        const data = userStorage.storage.get(userStorage.userModel.body);

        const header = new Header(this.#root, {
            user: { avatar: data.body.user.thumbnail_url },
        });
        header.render();

        const main = new Main(this.#root);
        main.render();

        const container = document.querySelector('.sticky-container');
        const sidebar = new Sidebar(container);
        sidebar.render();

        const allBoards = new AllBoards(container);
        allBoards.render();

        const contentContainer = document.querySelector('.content-container');

        const contentHeaderName = new ContentHeaderName(
            contentContainer,
            this.yourDesksConfig.contentHeaderName,
        );
        contentHeaderName.render();

        await dispatcher.dispatch(actionGetBoards());

        this.#renderOwnerWorkspace(undefined);
        this.#renderGuestWorspace(undefined);
        this.addEventListeners();
    }

    addEventListeners() {
        this.#root.querySelector('.log-out').addEventListener('click', this.logoutHandler);
    }

    logoutHandler(e) {
        e.preventDefault();

        dispatcher.dispatch(actionLogout());
    }

    close() {
        dispatcher.dispatch(actionRedirect('/signin', false, false));
    }

    clear() {
        document.querySelectorAll('div.layout').forEach((e) => {
            e.remove();
        });
    }
}

const desks = new Boards(document.querySelector('.page'));

export default desks;
