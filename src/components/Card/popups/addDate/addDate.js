import workspaceStorage from '../../../../storages/workspaceStorage.js';
import Component from '../../../core/basicComponent.js';
import popupEvent from '../../../core/popeventProcessing.js';
import template from './addDate.hbs';
import './addDate.scss';
/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class AddDate extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        this.parent
            .querySelector('button[data-action=manage-card-data]')
            .addEventListener('click', this.#openPopup);
        this.parent
            .querySelector('#card-date')
            .addEventListener('click', this.#closePopupByBackground);
    }

    removeEventListeners() {
        this.parent.querySelector('#card-date').removeEventListener('click', this.#openPopup);
        this.parent
            .querySelector('#card-date')
            .removeEventListener('click', this.#closePopupByBackground);
    }

    #openPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cardId = parseInt(this.parent.querySelector('#card').dataset.card, 10);
        const dialog = this.parent.querySelector('#card-date');
        const btnCoordinates = e.target.closest('button').getBoundingClientRect();

        if (cardId) {
            const card = workspaceStorage.getCardById(cardId);
            dialog.querySelector('.start-date__checkbox').checked = card.start !== null;
            dialog.querySelector('.end-date__checkbox').checked = card.end !== null;

            dialog.querySelector('.start-date__date').value = card.start ? card.start : '';
            dialog.querySelector('.end-date__date').value = card.end ? card.end : '';
        }

        if (dialog.getAttribute('open') === null) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
            popupEvent.addPopup(dialog);
            dialog.showModal();
            const dialogSizes = dialog.getBoundingClientRect();
            dialog.setAttribute(
                'style',
                `top: ${btnCoordinates.y - Math.floor(dialogSizes.height / 3)}px; left: ${
                    btnCoordinates.x + btnCoordinates.width + 20
                }px`,
            );
        } else {
            popupEvent.deletePopup(dialog);
            dialog.close();
        }
    };

    #closePopupByBackground = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.target === e.currentTarget) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
        }
    };
}
