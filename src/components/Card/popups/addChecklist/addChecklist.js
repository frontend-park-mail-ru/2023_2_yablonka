import {
    actionCreateChecklist,
    actionCreateChecklistItem,
    actionDeleteChecklist,
    actionUpdateChecklistItem,
} from '../../../../actions/boardActions.js';
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
        this.parent
            .querySelector('.card-information__checklists')
            .addEventListener('click', this.#removeChecklist);
        this.parent
            .querySelector('.card-information__checklists')
            .addEventListener('click', this.#createChecklistItemShow);
        this.parent
            .querySelector('.card-information__checklists')
            .addEventListener('click', this.#createChecklistItemClose);
        this.parent
            .querySelector('.card-information__checklists')
            .addEventListener('click', this.#createChecklistItem);
        this.parent
            .querySelector('.card-information__checklists')
            .addEventListener('click', this.#deleteCheckItem);
        this.parent
            .querySelector('.card-information__checklists')
            .addEventListener('click', this.#setCheckItemCheck);
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
        this.parent
            .querySelector('.card-information__checklists')
            .removeEventListener('click', this.#removeChecklist);
        this.parent
            .querySelector('.card-information__checklists')
            .removeEventListener('click', this.#createChecklistItemShow);
        this.parent
            .querySelector('.card-information__checklists')
            .removeEventListener('click', this.#createChecklistItemClose);
        this.parent
            .querySelector('.card-information__checklists')
            .removeEventListener('click', this.#createChecklistItem);
        this.parent
            .querySelector('.card-information__checklists')
            .removeEventListener('click', this.#deleteCheckItem);
        this.parent
            .querySelector('.card-information__checklists')
            .removeEventListener('click', this.#setCheckItemCheck);
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

    #removeChecklist = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const checklist = e.target.closest('.card-information__checklist-wrapper');
        if (e.target.closest('.btn-delete-checklist')) {
            const checklistId = parseInt(checklist.dataset.checklist, 10);
            dispatcher.dispatch(actionDeleteChecklist({ id: checklistId }));
        }
    };

    #createChecklistItemShow = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const btn = e.target.closest('.btn-add-checklist-element');
        if (btn) {
            btn.style.display = 'none';
            btn.nextElementSibling.style.display = 'flex';
        }
    };

    #createChecklistItemClose = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const btn = e.target.closest('.btn-checklist-new-item_cancel');

        if (btn) {
            const input = btn.closest('.checklist-new-item');
            input.querySelector('.input-checklist-new-item__input').value = '';
            input.style.display = 'none';
            input.previousElementSibling.style.display = 'flex';
        }
    };

    #createChecklistItem = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const btn = e.target.closest('.btn-checklist-new-item_save');

        if (btn) {
            const checklist = e.target.closest('.card-information__checklist-wrapper');
            const checklistId = parseInt(checklist.dataset.checklist, 10);
            const input = checklist.querySelector('.input-checklist-new-item__input');
            const name = input.value;

            if (Validator.validateObjectName(name)) {
                dispatcher.dispatch(
                    actionCreateChecklistItem({
                        checklist_id: checklistId,
                        done: false,
                        list_position: workspaceStorage.getChecklistItems(checklistId).length,
                        name,
                    }),
                );
            } else {
                NotificationMessage.showNotification(input, false, true, {
                    fontSize: 12,
                    fontWeight: 200,
                    text: 'Неккоректное название',
                });
            }
        }
    };

    #setCheckItemCheck = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const btn = e.target.closest('input-check-item__checkbox');

        if (btn) {
            const checklist = e.target.closest('.card-information__checklist-wrapper');
            const checklistItemId = parseInt(
                checklist.querySelector('.check-item').dataset.checkitem_id,
                10,
            );
            const input = checklist.querySelector('.input-check-item__checkbox');

            dispatcher.dispatch(
                actionUpdateChecklistItem({
                    done: input.hasAttribute('checked'),
                    id: checklistItemId,
                    list_position: workspaceStorage.getChecklistItems(parseInt(checklist.id, 10))
                        .length,
                    name: checklist.querySelector('.ard-information__card-checklist-title')
                        .textContent,
                }),
            );
        }
    };

    #deleteCheckItem = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const btn = e.target.closest('.btn-check-item_delete');

        if (btn) {
            const checklist = e.target.closest('.card-information__checklist-wrapper');
            const checklistItemId = parseInt(
                checklist.querySelector('.check-item').dataset.checkitem_id,
                10,
            );
            dispatcher.dispatch(actionUpdateChecklistItem({ id: checklistItemId }));
        }
    };
}
