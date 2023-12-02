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
            .querySelector('.start-date__checkbox-wrapper')
            .addEventListener('click', this.#blockDateInput);
        this.parent
            .querySelector('.end-date__checkbox-wrapper')
            .addEventListener('click', this.#blockDateInput);
        this.parent.querySelector('.btn-card-date_save').addEventListener('click', this.#sendTime);
        this.parent
            .querySelector('.btn-card-date_delete')
            .addEventListener('click', this.#deleteTime);
        this.parent
            .querySelector('#card-date')
            .addEventListener('click', this.#closePopupByBackground);
        this.parent
            .querySelector('.start-date__date')
            .addEventListener('change', this.#processDateSelect);
        this.parent
            .querySelector('.end-date__date')
            .addEventListener('change', this.#processDateSelect);
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
        this.parent
            .querySelector('.start-date__date')
            .removeEventListener('change', this.#processDateSelect);
        this.parent
            .querySelector('.end-date__date')
            .removeEventListener('change', this.#processDateSelect);
    }

    #processDateSelect = (e) => {
        const { target } = e;
        const startDate = this.parent.querySelector('.start-date__date');
        const endDate = this.parent.querySelector('.end-date__date');
        const start = startDate.value;
        const end = endDate.value;
        startDate.value = start;
        endDate.value = end;
        if (start !== '' && end !== '') {
            const startTime = new Date(start);
            const endTime = new Date(end);

            if (target.dataset.time === 'start') {
                endDate.value =
                    endTime < startTime
                        ? new Date(startTime.setDate(startTime.getDate() + 1))
                              .toISOString()
                              .split('T')[0]
                        : end;
            }

            if (target.dataset.time === 'end') {
                startDate.value =
                    startTime > endTime
                        ? new Date(endTime.setDate(endTime.getDate() - 1))
                              .toISOString()
                              .split('T')[0]
                        : start;
            }
        }
    };

    #blockDateInput = (e) => {
        e.stopPropagation();

        const checkbox = e.target;
        const dateInput = e.target.parentNode.nextElementSibling;

        if (checkbox.hasAttribute('checked')) {
            dateInput.disabled = true;
            dateInput.setAttribute('style', 'color: var(--text-color-on-page-inactive)');
            dateInput.value = '';

            checkbox.removeAttribute('checked');
        } else {
            dateInput.disabled = false;
            dateInput.setAttribute('style', 'color: var(--text-color-on-page)');
            dateInput.value = '';

            checkbox.setAttribute('checked', '');
        }
    };

    #sendTime = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cardId = parseInt(this.parent.querySelector('#card').dataset.card, 10);
        if (cardId) {
            const dialog = this.parent.querySelector('#card-date');
            const card = workspaceStorage.getCardById(cardId);
            const start = dialog.querySelector('.start-date__date').value;
            const end = dialog.querySelector('.end-date__date').value;

            dispatcher.dispatch(
                actionUpdateCard({
                    description: card.description,
                    end: end === '' ? null : new Date(end).toISOString(),
                    id: cardId,
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

            if (!dialog.hasAttribute('open')) {
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

    #preprocessDates = (card) => {
        const dialog = this.parent.querySelector('#card-date');

        const startCheckbox = dialog.querySelector('.start-date__checkbox');
        const startInput = startCheckbox.parentNode.nextElementSibling;

        const endCheckbox = dialog.querySelector('.end-date__checkbox');
        const endInput = endCheckbox.parentNode.nextElementSibling;

        if (card.start !== null) {
            startCheckbox.checked = true;
            startCheckbox.setAttribute('checked', '');

            startCheckbox.removeAttribute('style');

            startInput.disabled = false;
            [dialog.querySelector('.start-date__date').value] = card.start.split('T');
        } else {
            startInput.disabled = true;
        }

        if (card.end !== null) {
            endCheckbox.checked = true;
            endCheckbox.setAttribute('checked', '');

            endCheckbox.removeAttribute('style');

            endInput.disabled = false;
            [dialog.querySelector('.end-date__date').value] = card.end.split('T');
        } else {
            endInput.disabled = true;
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
