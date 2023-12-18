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
        window.addEventListener('resize', this.#resize);
    }

    removeEventListeners() {
        this.parent
            .querySelector('.change-avatar__button')
            .removeEventListener('click', this.#changeAvatarMenu);
        this.parent
            .querySelector('button[data-action="delete-avatar"]')
            .removeEventListener('click', this.#deleteAvatar);
        window.removeEventListener('resize', this.#resize);
    }

    #changeAvatarMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#change-avatar');

        if (!dialog.hasAttribute('open')) {
            popupEvent.closeAllPopups();
            popupEvent.addPopup(dialog);
            dialog.show();

            const dialogSizes = dialog.getBoundingClientRect();
            const btnSizes = e.target.closest('.change-avatar__button').getBoundingClientRect();

            dialog.setAttribute(
                'style',
                `top: ${btnSizes.top + 50}px; left: ${Math.floor(
                    btnSizes.left - dialogSizes.width / 2,
                )}px`,
            );
        } else {
            popupEvent.deletePopup(dialog);
            dialog.close();
        }
    };

    #resize = () => {
        const dialog = this.parent.querySelector('#change-avatar');

        window.requestAnimationFrame(() => {
            const dialogSizes = dialog.getBoundingClientRect();
            const btnSizes = this.parent
                .querySelector('.change-avatar__button')
                .getBoundingClientRect();

            dialog.setAttribute(
                'style',
                `top: ${btnSizes.top + 50}px; left: ${Math.floor(
                    btnSizes.left - dialogSizes.width / 2,
                )}px`,
            );
        });
    };

    async #deleteAvatar(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!this.parent.querySelector('.profile-user-image').src.includes('avatar.jpg')) {
            await dispatcher.dispatch(actionDeleteAvatar());
        }
    }
}
