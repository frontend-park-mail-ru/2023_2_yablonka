import { actionRedirect } from '../../actions/userActions.js';
import Component from '../../components/core/basicComponent.js';
import dispatcher from '../../modules/dispatcher.js';
import userStorage from '../../storages/userStorage.js';
import template from './error403.hbs';

/**
 * Страница 403
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Error403 extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML(
            'beforeend',
            template({ redirectionPage: this.config.redirectionPage }),
        );
    }

    /**
     * Добавляет подписки на события
     */
    addEventListeners() {
        this.parent.querySelector('.btn-not-found').addEventListener('click', this.redirectHandler);
    }

    /**
     * Добавляет подписки на события
     */
    removeEventListeners() {
        this.parent
            .querySelector('.btn-not-found')
            .removeEventListener('click', this.redirectHandler);
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
}
