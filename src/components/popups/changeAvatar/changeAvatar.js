import dispatcher from '../../../modules/dispatcher.js';
import Component from '../../core/basicComponent.js';
import popupEvent from '../../core/popeventProcessing.js';
import template from './changeAvatar.hbs';
import { actionDeleteAvatar } from '../../../actions/userActions.js';
import './changeAvatar.scss';
/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class ChangeAvatarPopup extends Component {
    #innerConfig = {
        buttons: [
            {
                action: 'open-upload-avatar-modal',
                title: 'Изменить аватар',
            },
            {
                action: 'delete-avatar',
                title: 'Удалить аватар',
            },
        ],
    };

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.#innerConfig));
    }

    addEventListeners() {
        this.parent
            .querySelector('.change-avatar__button')
            .addEventListener('click', this.#changeAvatarMenu);
        this.parent
            .querySelector('button[data-action="delete-avatar"]')
            .addEventListener('click', this.#deleteAvatar);
    }

    removeEventListeners() {
        this.parent
            .querySelector('.change-avatar__button')
            .removeEventListener('click', this.#changeAvatarMenu);
        this.parent
            .querySelector('button[data-action="delete-avatar"]')
            .removeEventListener('click', this.#deleteAvatar);
    }

    #changeAvatarMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#change-avatar');

        if (!dialog.hasAttribute('open')) {
            popupEvent.closeAllPopups();
            popupEvent.addPopup(dialog);
            dialog.show();
        } else {
            popupEvent.deletePopup(dialog);
            dialog.close();
        }
    };

    async #deleteAvatar(e) {
        e.preventDefault();
        e.stopPropagation();

        await dispatcher.dispatch(actionDeleteAvatar());
    }
}
