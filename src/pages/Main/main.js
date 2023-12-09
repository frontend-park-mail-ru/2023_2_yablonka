import { actionLogout, actionNavigate, actionRedirect } from '../../actions/userActions.js';
import Header from '../../components/Common/header/header.js';
import Sidebar from '../../components/Main/sidebar/sidebar.js';
import UserWorkspaces from '../../components/Main/userWorkspaces/userWorkspaces.js';
import Component from '../../components/core/basicComponent.js';
import popupEvent from '../../components/core/popeventProcessing.js';
import emitter from '../../modules/actionTrigger.js';
import dispatcher from '../../modules/dispatcher.js';
import template from './main.hbs';
import './main.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class MainPage extends Component {

    draggingElement;

    /**
     * Рендерит компонент в DOM
     */
    render() {
        const page = {
            header: new Header(null, { avatar: this.config.user.avatar_url }).render(),
            sidebar: new Sidebar(null, this.config.workspaces).render(),
            userWorkspaces: new UserWorkspaces(null, this.config.workspaces).render(),
        };
        this.parent.insertAdjacentHTML('beforeend', template(page));
    }

    /**
     * Добавляет обработчики событий
     */
    addEventListeners() {
        this.parent.querySelector('.logo-wrapper').addEventListener('click', this.toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=boards]')
            .addEventListener('click', this.toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=logout]')
            .addEventListener('click', this.logoutHandler);
        this.parent
            .querySelector('.profile-link[data-action=profile]')
            .addEventListener('click', this.toProfileHandler);
        this.parent
            .querySelector('.profile-link[data-action=security]')
            .addEventListener('click', this.toSecurityHandler);
        this.parent.querySelectorAll('.link-user-board').forEach((link) => {
            link.addEventListener('click', this.toBoardHandler);
        });
        this.parent.addEventListener('click', popupEvent.closeAllPopups);
        this.parent.addEventListener('drag', this.#dragHandler);
        this.parent.addEventListener('dragover', this.#dragoverHandler);
        this.parent.addEventListener('drop', this.#dropHandler);

        emitter.bind('logout', this.close);
    }

    /**
     * Убирает обработчики событий
     */
    removeEventListeners() {
        this.parent
            .querySelector('.logo-wrapper')
            .removeEventListener('click', this.toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=boards]')
            .removeEventListener('click', this.toBoardsHandler);
        this.parent
            .querySelector('.profile-link[data-action=logout]')
            .removeEventListener('click', this.logoutHandler);
        this.parent
            .querySelector('.profile-link[data-action=profile]')
            .removeEventListener('click', this.toProfileHandler);
        this.parent
            .querySelector('.profile-link[data-action=security]')
            .removeEventListener('click', this.toSecurityHandler);
        this.parent.querySelectorAll('.link-user-board').forEach((link) => {
            link.removeEventListener('click', this.toBoardHandler);
        });
        this.parent.removeEventListener('click', popupEvent.closeAllPopups);
        this.parent.removeEventListener('drag', this.#dragHandler);
        this.parent.removeEventListener('dragover', this.#dragoverHandler);
        this.parent.removeEventListener('drop', this.#dropHandler);


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
     * Handler события нажатия на ссылку для перехода на страницу доски
     * @param {Event} e - Событие
     */
    toBoardHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(
            actionRedirect(e.target.closest('.link-user-board').getAttribute('href'), false),
        );
    }

    #dragHandler(e){
        e.preventDefault();

        this.draggingElement = e.target.closest('a');
        if(!this.draggingElement?.classList?.contains('link-user-board')){
            this.draggingElement=null;
            return;
        }

        this.draggingElement.style.display='none';
    }

    #dragoverHandler(e){
        e.preventDefault();
    }
    
    #dropHandler(e){
        e.preventDefault();

        if(this.draggingElement)
        {
            this.draggingElement.style.display='flex';
        }

        if(e.target.closest('.workspace')&&this.draggingElement.classList.contains('link-user-board')){
            if(e.target.closest('.link-user-board'))
            {
                const elementCoord = e.target.closest('.link-user-board').getBoundingClientRect();
                const elementCenter = elementCoord.x + elementCoord.width/2;

                const position = e.clientX<elementCenter ? 'beforebegin':'afterend';
                
                e.target.closest('.link-user-board').insertAdjacentHTML(position, this.draggingElement.outerHTML);
                this.draggingElement.outerHTML ='';
            }
            else {
                e.target.closest('.workspace').querySelector('.workspace__boards').insertAdjacentHTML('afterbegin', this.draggingElement.outerHTML);
                this.draggingElement.outerHTML ='';
            }

            this.draggingElement = null;
        }
    }

    /**
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/signin', false));
    }
}
