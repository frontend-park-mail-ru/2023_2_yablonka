import { actionNavigate, actionRedirect } from '../../actions/userActions.js';
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
        this.parent.addEventListener('click', this.#toBoardHandler);
        this.parent.addEventListener('click', popupEvent.closeAllPopups);

        emitter.bind('logout', this.close);
    }

    /**
     * Убирает обработчики событий
     */
    removeEventListeners() {
        this.parent.removeEventListener('click', this.#toBoardHandler);
        this.parent.removeEventListener('click', popupEvent.closeAllPopups);

        emitter.unbind('logout', this.close);
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу доски
     * @param {Event} e - Событие
     */
    #toBoardHandler = (e) => {
        if (e.target.closest('.link-user-board')) {
            e.stopPropagation();
            e.preventDefault();
            dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
            dispatcher.dispatch(
                actionRedirect(e.target.closest('.link-user-board').getAttribute('href'), false),
            );
        }
    };

    /**
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/signin', false));
    }
}
