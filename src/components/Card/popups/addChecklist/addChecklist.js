import Component from '../../../core/basicComponent.js';
import popupEvent from '../../../core/popeventProcessing.js';
import template from './addChecklist.hbs';
import './addChecklist.scss';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class AddChecklist extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        this.parent
            .querySelector('button[data-action=manage-card-checklist]')
            .addEventListener('click', this.#openPopup);
        this.parent
            .querySelector('#card-checklist')
            .addEventListener('click', this.#closePopupByBackground);
    }

    removeEventListeners() {
        this.parent
            .querySelector('button[data-action=manage-card-checklist]')
            .removeEventListener('click', this.#openPopup);
        this.parent
            .querySelector('#card-checklist')
            .removeEventListener('click', this.#closePopupByBackground);
    }

    #openPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cardId = parseInt(this.parent.querySelector('#card').dataset.card, 10);
        const dialog = this.parent.querySelector('#card-checklist');
        const btnCoordinates = e.target.closest('button').getBoundingClientRect();

        if (cardId) {
            if (dialog.getAttribute('open') === null) {
                popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
                popupEvent.addPopup(dialog);
                dialog.showModal();
                const dialogSizes = dialog.getBoundingClientRect();
                dialog.setAttribute(
                    'style',
                    `top: ${btnCoordinates.y - Math.floor(dialogSizes.height / 3)}px; left: ${
                        btnCoordinates.x - 10
                    }px`,
                );
            } else {
                popupEvent.deletePopup(dialog);
                dialog.close();
            }
        }
    };

    #closePopupByBackground = (e) => {
        e.stopPropagation();

        if (e.target === e.currentTarget) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
        }
    };
}
