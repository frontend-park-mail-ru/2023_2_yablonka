import { actionUpdateCard } from '../../../../actions/boardActions.js';
import dispatcher from '../../../../modules/dispatcher.js';
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
            .querySelector('.start-date__checkbox')
            .addEventListener('click', this.#blockDateInput);
        this.parent
            .querySelector('.end-date__checkbox')
            .addEventListener('click', this.#blockDateInput);
        this.parent.querySelector('.btn-card-date_save').addEventListener('click', this.#sendTime);
        this.parent
            .querySelector('.btn-card-date_delete')
            .addEventListener('click', this.#deleteTime);
        this.parent
            .querySelector('#card-date')
            .addEventListener('click', this.#closePopupByBackground);
    }

    removeEventListeners() {
        this.parent.querySelector('#card-date').removeEventListener('click', this.#openPopup);
        this.parent
            .querySelector('.start-date__checkbox')
            .removeEventListener('click', this.#blockDateInput);
        this.parent
            .querySelector('.end-date__checkbox')
            .removeEventListener('click', this.#blockDateInput);
        this.parent
            .querySelector('.btn-card-date_save')
            .removeEventListener('click', this.#sendTime);
        this.parent
            .querySelector('#card-date')
            .removeEventListener('click', this.#closePopupByBackground);
    }

    #blockDateInput = (e) => {
        e.stopPropagation();

        const checkbox = e.target;
        const dateInput = e.target.nextElementSibling;

        if (checkbox.getAttribute('checked') !== null) {
            dateInput.disabled = true;
            dateInput.setAttribute('style', 'color: var(--text-color-on-page-inactive)');
            checkbox.removeAttribute('checked');
        } else {
            dateInput.disabled = false;
            dateInput.setAttribute('style', 'color: var(--text-color-on-page)');
            checkbox.setAttribute('checked', '');
        }
    };

    #sendTime = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const catdId = parseInt(this.parent.querySelector('#card').dataset.card, 10);
        if (catdId) {
            const dialog = this.parent.querySelector('#card-date');
            const card = workspaceStorage.getCardById(catdId);
            const start = dialog.querySelector('.start-date__date').value;
            const end = dialog.querySelector('.end-date__date').value;

            dispatcher.dispatch(
                actionUpdateCard({
                    description: card.description,
                    end: end === '' ? null : new Date(end).toISOString(),
                    id: catdId,
                    list_position: card.list_position,
                    name: card.name,
                    start: start === '' ? null : new Date(start).toISOString(),
                }),
            );
        }
    };

    #deleteTime = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const catdId = parseInt(this.parent.querySelector('#card').dataset.card, 10);
        if (catdId) {
            const card = workspaceStorage.getCardById(catdId);

            dispatcher.dispatch(
                actionUpdateCard({
                    description: card.description,
                    end: null,
                    id: catdId,
                    list_position: card.list_position,
                    name: card.name,
                    start: null,
                }),
            );
        }
    };

    #openPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cardId = parseInt(this.parent.querySelector('#card').dataset.card, 10);
        const dialog = this.parent.querySelector('#card-date');
        const btnCoordinates = e.target.closest('button').getBoundingClientRect();

        if (cardId) {
            const card = workspaceStorage.getCardById(cardId);

            this.#preprocessDates(card);

            if (dialog.getAttribute('open') === null) {
                popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
                popupEvent.addPopup(dialog);
                dialog.showModal();
                const dialogSizes = dialog.getBoundingClientRect();
                dialog.setAttribute(
                    'style',
                    `top: ${btnCoordinates.y - Math.floor(dialogSizes.height / 3)}px; left: ${
                        btnCoordinates.x + btnCoordinates.width + 50
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

    #preprocessDates = (card) => {
        const dialog = this.parent.querySelector('#card-date');

        if (card.start !== null) {
            dialog.querySelector('.start-date__checkbox').setAttribute('checked', '');
            [dialog.querySelector('.start-date__date').value] = card.start.split('T');
        }
        if (card.end !== null) {
            dialog.querySelector('.end-end__checkbox').setAttribute('checked', '');
            [dialog.querySelector('.end-date__date').end] = card.end.split('T');
        }

        const textColorStartDate = card.start
            ? '--text-color-on-page'
            : '--text-color-on-page-inactive';
        const textColorEndDate = card.end
            ? '--text-color-on-page'
            : '--text-color-on-page-inactive';

        dialog
            .querySelector('.start-date__date')
            .setAttribute('style', `color: var(${textColorStartDate})`);
        dialog
            .querySelector('.end-date__date')
            .setAttribute('style', `color: var(${textColorEndDate})`);
    };
}
