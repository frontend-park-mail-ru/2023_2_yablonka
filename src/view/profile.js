import Header from '../components/deskComponents/header/header.js';
import { actionRedirect, actionLogout, actionNavigate } from '../actions/userActions.js';
import userStorage from '../storages/userStorage.js';
import emitter from '../modules/eventTrigger.js';
import dispatcher from '../modules/dispatcher.js';
import workspaceStorage from '../storages/workspaceStorage.js';

/**
 * Класс для рендера страницы профиля
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
class Profile {
    #root;

    /**
     * @constructor
     */
    constructor() {
        this.#root = document.querySelector('.page');
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        this.#root.innerHTML = '';
        this.#root.style.backgroundColor = '';

        document.title = 'Tabula: Профиль';

        const user = userStorage.storage.get(userStorage.userModel.body);

        const header = new Header(this.#root, {
            user: { avatar: user.body.user.thumbnail_url },
        });
        header.render();

        this.addListeners();
    }

    /**
     * Добавляет обработчики событий
     */
    addListeners() {
        this.#root.querySelector('.log-out').addEventListener('click', this.logoutHandler);
        emitter.bind('logout', this.close);
    }

    /**
     * Убирает обработчики событий
     */
    removeListeners() {
        this.#root.querySelector('.log-out').removeEventListener('click', this.logoutHandler);
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
     * Закрытие страницы и редирект на страницу логина
     */
    close() {
        dispatcher.dispatch(actionNavigate(window.location.href, '', true));
        dispatcher.dispatch(actionRedirect('/signin', false));
        dispatcher.dispatch(actionNavigate(`${window.location.origin}/signin`, '', false));
    }

    /**
     * Очистка страницы
     */
    clear() {
        this.removeListeners();
        this.#root.innerHTML = '';
    }
}

const profile = new Profile();

export default profile;
