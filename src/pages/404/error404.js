import { actionRedirect } from '../../actions/userActions.js';
import Component from '../../components/core/basicComponent.js';
import dispatcher from '../../modules/dispatcher.js';
import userStorage from '../../storages/userStorage.js';
import template from './error404.hbs';
import './error404.scss';

/**
 * Контейнер для досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Error404 extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

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
        document.querySelector('.btn-not-found').addEventListener('click', this.redirectHandler);
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
