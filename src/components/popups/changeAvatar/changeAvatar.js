import Component from '../../core/basicComponent.js';
import popupEvent from '../../core/popeventProcessing.js';
import template from './changeAvatar.hbs';
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
        document
            .querySelector('.change-avatar__button')
            .addEventListener('click', this.#changeAvatarMenu);
    }

    removeEventListeners() {
        document
            .querySelector('.change-avatar__button')
            .removeEventListener('click', this.#changeAvatarMenu);
    }

    #changeAvatarMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = document.querySelector('#change-avatar');

        if (dialog.getAttribute('open') !== null) {
            popupEvent.deletePopup(dialog);
            dialog.close();
        } else {
            popupEvent.addPopup(dialog);
            dialog.show();
            popupEvent.closeOtherPopups(dialog);
        }
    };
}
