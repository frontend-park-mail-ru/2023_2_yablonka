import Header from '../components/header/header.js';
import ContainerMain from '../components/Main/containerMain/containerMain.js';
import Sidebar from '../components/Main/sidebar/sidebar.js';
import UserWorkspaces from '../components/Main/userWorkspaces/userWorkspaces.js';
import Navigation from '../components/popups/navigation/navigation.js';
import { actionRedirect, actionLogout, actionNavigate } from '../actions/userActions.js';
import { actionGetBoards } from '../actions/workspaceActions.js';
import userStorage from '../storages/userStorage.js';
import emitter from '../modules/actionTrigger.js';
import dispatcher from '../modules/dispatcher.js';
import workspaceStorage from '../storages/workspaceStorage.js';
import popeventProcess from '../components/core/popeventProcessing.js';
import PageLayoutMain from '../components/Main/pageLayoutMain/pageLayoutMain.js';

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

        new PageLayoutMain(this.#root, {}).render();
        const pageLayout = document.querySelector('.page__layout-main');

        new Header(pageLayout, {
            avatar: user.body.user.thumbnail_url,
        }).render();

        new ContainerMain(pageLayout, {}).render();
        const mainContainer = document.querySelector('.container-main');

        new Sidebar(mainContainer, user).render();
        new UserWorkspaces(mainContainer, user).render();

        await dispatcher.dispatch(actionGetBoards());

        new Navigation(this.#root, {
            email: user.body.user.email,
            avatar: user.body.user.thumbnail_url,
            name: `${user.body.user.name ? user.body.user.name : ''} ${
                user.body.user.surname ? user.body.user.surname : ''
            }`,
        }).render();
        this.addListeners();
    }

    /**
     * Добавляет обработчики событий
     */
    addListeners() {
        Navigation.addEventListeners();

        this.#root.addEventListener('click', popeventProcess);

        this.#root.querySelector('.logo-wrapper').addEventListener('click', this.toBoardsHandler);
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
        Navigation.removeEventListeners();

        this.#root.removeEventListener('click', popeventProcess);

        this.#root
            .querySelector('.logo-wrapper')
            .removeEventListener('click', this.toBoardsHandler);
        this.#root
            .querySelector('.profile-link[data-action=boards]')
            .removeEventListener('click', this.toBoardsHandler);
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
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/boards', false));
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу смены пароля
     * @param {Event} e - Событие
     */
    toSecurityHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/security', false));
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу профиля
     * @param {Event} e - Событие
     */
    toProfileHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/profile', false));
    }

    /**
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/signin', false));
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
