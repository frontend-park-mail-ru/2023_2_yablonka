import Header from '../components/header/header.js';
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
import NavPopup from '../components/navPopup/navPopup.js';
import { actionRedirect, actionLogout, actionNavigate } from '../actions/userActions.js';
import { actionGetBoards } from '../actions/workspaceActions.js';
import userStorage from '../storages/userStorage.js';
import emitter from '../modules/eventTrigger.js';
import dispatcher from '../modules/dispatcher.js';
import workspaceStorage from '../storages/workspaceStorage.js';
import navPopupAction from '../components/navPopup/navPopupHelper.js';
import popeventProcess from '../components/core/popeventProcessing.js';

/**
 * Класс для рендера страницы досок
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
class Boards {
    #root;

    /**
     * @constructor
     */
    constructor() {
        this.#root = document.querySelector('.page');
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
        document.title = 'Tabula: Ваши Доски';

        const user = userStorage.storage.get(userStorage.userModel.body);

        const header = new Header(this.#root, {
            user: { avatar: user.body.user.thumbnail_url },
        });
        header.render();

        const namesurname = `${user.body.user.name ? user.body.user.name : ''} ${
            user.body.user.surname ? user.body.user.surname : ''
        }`;

        const navPopup = new NavPopup(this.#root, {
            email: user.body.user.email,
            avatar: user.body.user.thumbnail_url,
            name: namesurname,
        });

        navPopup.render();

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

        const boards = workspaceStorage.storage.get(workspaceStorage.workspaceModel.body);

        this.#renderOwnerWorkspace(boards.body?.boards.user_owned_boards);
        this.#renderGuestWorspace(boards.body?.boards.user_guest_boards);
        this.addListeners();
    }

    /**
     * Добавляет обработчики событий
     */
    addListeners() {
        this.#root.querySelector('.avatar__button').addEventListener('click', navPopupAction);
        this.#root.addEventListener('click', popeventProcess);

        this.#root
            .querySelector('.link-button-logo')
            .addEventListener('click', this.toBoardsHandler);
        this.#root
            .querySelector('.profile-link[data-action=boards]')
            .addEventListener('click', this.toBoardsHandler);
        this.#root
            .querySelector('.profile-link[data-action=logout]')
            .addEventListener('click', this.logoutHandler);
        this.#root
            .querySelector('.profile-link[data-action=profile]')
            .addEventListener('click', this.toProfileHandler);
        this.#root
            .querySelector('.profile-link[data-action=security]')
            .addEventListener('click', this.toSecurityHandler);
        emitter.bind('logout', this.close);
    }

    /**
     * Убирает обработчики событий
     */
    removeListeners() {
        this.#root.querySelector('.avatar__button').removeEventListener('click', navPopupAction);
        this.#root.removeEventListener('click', popeventProcess);

        this.#root
            .querySelector('.profile-link[data-action=logout]')
            .removeEventListener('click', this.logoutHandler);
        this.#root
            .querySelector('.profile-link[data-action=profile]')
            .removeEventListener('click', this.toProfileHandler);
        this.#root
            .querySelector('.profile-link[data-action=security]')
            .removeEventListener('click', this.toSecurityHandler);
        emitter.unbind('logout', this.close);
    }

    /**
     * Handler события нажатия на ссылку для перехода на log out
     * @param {Event} e - Событие
     */
    logoutHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionLogout());
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу досок
     * @param {Event} e - Событие
     */
    toBoardsHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.href, '', true));
        dispatcher.dispatch(actionRedirect(`${window.location.origin}/boards`, false));
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу смены пароля
     * @param {Event} e - Событие
     */
    toSecurityHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.href, '', true));
        dispatcher.dispatch(actionRedirect(`${window.location.origin}/security`, false));
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу профиля
     * @param {Event} e - Событие
     */
    toProfileHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.href, '', true));
        dispatcher.dispatch(actionRedirect(`${window.location.origin}/profile`, false));
    }

    /**
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.href, '', true));
        dispatcher.dispatch(actionRedirect(`${window.location.origin}/signin`, false));
    }

    /**
     * Очистка страницы
     */
    clear() {
        this.removeListeners();
        this.#root.innerHTML = '';
    }
}

const desks = new Boards();

export default desks;
