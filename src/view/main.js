// Components
import PageLayoutMain from '../components/Main/pageLayoutMain/pageLayoutMain.js';
import ContainerMain from '../components/Main/containerMain/containerMain.js';
import Header from '../components/Common/header/header.js';
import Sidebar from '../components/Main/sidebar/sidebar.js';
import UserWorkspaces from '../components/Main/userWorkspaces/userWorkspaces.js';
// popups
import Navigation from '../components/popups/navigation/navigation.js';
import popeventProcess from '../components/core/popeventProcessing.js';
// actions
import { actionRedirect, actionLogout, actionNavigate } from '../actions/userActions.js';
import { actionGetWorkspaces } from '../actions/workspaceActions.js';
// storages
import userStorage from '../storages/userStorage.js';
// routing
import emitter from '../modules/actionTrigger.js';
import dispatcher from '../modules/dispatcher.js';
import workspaceStorage from '../storages/workspaceStorage.js';
import CreateWorkspace from '../components/popups/createWorkspace/createWorkspace.js';

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
        emitter.bind('renderWorkspaces', this.rerender.bind(this));
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        document.title = 'Tabula: Ваши Доски';

        const { user } = userStorage.storage.get(userStorage.userModel.body).body;

        new PageLayoutMain(this.#root, {}).render();
        const pageLayout = document.querySelector('.page__layout-main');

        new Header(pageLayout, user).render();

        new ContainerMain(pageLayout, {}).render();
        const mainContainer = document.querySelector('.container-main');

        await dispatcher.dispatch(actionGetWorkspaces());

        const { workspaces } = workspaceStorage.storage.get(workspaceStorage.workspaceModel.body)
            .body;

        new Sidebar(mainContainer, workspaces).render();
        new UserWorkspaces(mainContainer, workspaces).render();

        new Navigation(this.#root, {
            email: user.email,
            avatar: user.avatar_url,
            name: `${user.name ? user.name : ''} ${user.surname ? user.surname : ''}`,
        }).render();

        new CreateWorkspace(this.#root, {}).render();

        this.addListeners();
    }

    /**
     * Добавляет обработчики событий
     */
    addListeners() {
        Navigation.addEventListeners();
        CreateWorkspace.addEventListeners();

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
        CreateWorkspace.removeEventListeners();

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

    async rerender() {
        this.clear();
        this.renderPage();
        this.addListeners();
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
        dispatcher.dispatch(actionRedirect('/main', false));
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

const main = new Boards();

export default main;
