import { actionCreateChecklist } from '../../../../actions/boardActions.js';
import dispatcher from '../../../../modules/dispatcher.js';
import Validator from '../../../../modules/validator.js';
import workspaceStorage from '../../../../storages/workspaceStorage.js';
import NotificationMessage from '../../../Common/notification/notificationMessage.js';
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
        this.parent
            .querySelector('.btn-create-checklist')
            .addEventListener('click', this.#createChecklist);
        this.parent
            .querySelector('.input-card-checklist__input')
            .addEventListener('input', this.#blockButton);
    }

    removeEventListeners() {
        this.parent
            .querySelector('button[data-action=manage-card-checklist]')
            .removeEventListener('click', this.#openPopup);
        this.parent
            .querySelector('#card-checklist')
            .removeEventListener('click', this.#closePopupByBackground);
        this.parent
            .querySelector('.btn-create-checklist')
            .removeEventListener('click', this.#createChecklist);
        this.parent
            .querySelector('.input-card-checklist__input')
            .removeEventListener('input', this.#blockButton);
    }

    #openPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#card-checklist');
        const btnCoordinates = e.target.closest('button').getBoundingClientRect();

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
    };

    #closePopupByBackground = (e) => {
        e.stopPropagation();

        if (e.target === e.currentTarget) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
        }
    };

    #createChecklist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cardId = parseInt(this.parent.querySelector('#card').dataset.card, 10);
        const input = this.parent.querySelector('.input-card-checklist__input');
        const name = input.value;

        if (Validator.validateObjectName(name)) {
            dispatcher.dispatch(
                actionCreateChecklist({
                    name,
                    task_id: cardId,
                    list_position: workspaceStorage.getCardChecklists(cardId).length,
                }),
            );
        } else {
            NotificationMessage.showNotification(input, false, true, {
                fontSize: 12,
                fontWeight: 200,
                text: 'Неккоректное название',
            });
        }
    };

    #blockButton = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const input = this.parent.querySelector('.input-card-checklist__input');
        const btnCreate = this.parent.querySelector('.btn-create-checklist');

        if (input.value.length === 0) {
            btnCreate.disabled = true;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--need-text-color)');
        } else {
            btnCreate.disabled = false;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--main-btn-border-color)');
        }
    };
}
