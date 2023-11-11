import dispatcher from '../modules/dispatcher.js';
import { actionRedirect } from '../actions/userActions.js';
import userStorage from '../storages/userStorage.js';
import Error404 from '../components/404/error404.js';

class Page404 {
    #root;

    #userStatus;

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
        this.clear();

        document.title = 'Tabula: Not found';

        const redirectName =
            userStorage.storage.get(userStorage.userModel.status) === 200
                ? 'На главную'
                : 'Авторизоваться';

        const notFound = new Error404(this.#root, { redirectTargetName: redirectName });
        notFound.render();

        this.addEventListeners();
    }

    /**
     * Добавляет подписки на события
     */
    addEventListeners() {
        this.#root
            .querySelector('.btn-not-found')
            .addEventListener('click', this.redirectHandler);
    }

    /**
     * Хендлер события нажатия на ссылку перехода на регистрацию
     * @param {Event} e - Событие
     */
    redirectHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(
            actionRedirect(
                userStorage.storage.get(userStorage.userModel.status) === 200 ? '/main' : '/signin',
                false,
            ),
        );
    }

    /**
     * Очистка страницы
     */
    clear() {
        this.#root.innerHTML = '';
    }
}

const page404 = new Page404();

export default page404;
