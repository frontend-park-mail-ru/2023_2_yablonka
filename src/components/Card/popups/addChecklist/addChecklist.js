import {
    actionCreateChecklist,
    actionCreateChecklistItem,
    actionDeleteChecklist,
    actionDeleteChecklistItem,
    actionUpdateChecklistItem,
} from '../../../../actions/boardActions.js';
import dispatcher from '../../../../modules/dispatcher.js';
import Validator from '../../../../modules/validator.js';
import workspaceStorage from '../../../../storages/workspaceStorage.js';
import NotificationMessage from '../../../Common/notification/notificationMessage.js';
import Component from '../../../core/basicComponent.js';
import popupEvent from '../../../core/popeventProcessing.js';
import CheckItem from '../../atomic/checkItem/checkItem.js';
import Checklist from '../../atomic/checklist/checklist.js';
import ChecklistsContainer from '../../checklistsContainer/checklistsContainer.js';
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

    /**
     * Функция, добавляющая обработчики событий
     */
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
            .querySelector('.card-data__card-information')
            .addEventListener('click', this.#deleteChecklist);
        this.parent
            .querySelector('.card-data__card-information')
            .addEventListener('click', this.#createChecklistItemShow);
        this.parent
            .querySelector('.card-data__card-information')
            .addEventListener('click', this.#createChecklistItemClose);
        this.parent
            .querySelector('.card-data__card-information')
            .addEventListener('click', this.#createChecklistItem);
        this.parent
            .querySelector('.card-data__card-information')
            .addEventListener('click', this.#deleteCheckItem);
        this.parent
            .querySelector('.card-data__card-information')
            .addEventListener('click', this.#setCheckItemCheck);
        this.parent
            .querySelector('.card-data__card-information')
            .addEventListener('keydown', this.#proccessKeydownWithChecklist);
        window.addEventListener('resize', this.#resize);
    }

    /**
     * Функция, удаляющая обработчики событий
     */
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
            .querySelector('.card-data__card-information')
            .removeEventListener('click', this.#deleteChecklist);
        this.parent
            .querySelector('.card-data__card-information')
            .removeEventListener('click', this.#createChecklistItemShow);
        this.parent
            .querySelector('.card-data__card-information')
            .removeEventListener('click', this.#createChecklistItemClose);
        this.parent
            .querySelector('.card-data__card-information')
            .removeEventListener('click', this.#createChecklistItem);
        this.parent
            .querySelector('.card-data__card-information')
            .removeEventListener('click', this.#deleteCheckItem);
        this.parent
            .querySelector('.card-data__card-information')
            .removeEventListener('click', this.#setCheckItemCheck);
        this.parent
            .querySelector('.card-data__card-information')
            .removeEventListener('keydown', this.#proccessKeydownWithChecklist);
        window.removeEventListener('resize', this.#resize);
    }

    /**
     * Функция, добавляющая обработчики событий
     */
    #openPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#card-checklist');
        const btnCoordinates = this.parent
            .querySelector('button[data-action="manage-card-checklists"]')
            .getBoundingClientRect();

        if (dialog.getAttribute('open') === null) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
            popupEvent.addPopup(dialog);
            dialog.showModal();
            const dialogSizes = dialog.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            if (windowWidth - (btnCoordinates.left + dialogSizes.width) < 1) {
                dialog.setAttribute(
                    'style',
                    `top: ${btnCoordinates.top + btnCoordinates.height + 10}px; left: ${
                        windowWidth - dialogSizes.width
                    }px`,
                );
            } else {
                dialog.setAttribute(
                    'style',
                    `top: ${btnCoordinates.top + btnCoordinates.height + 10}px; left: ${
                        btnCoordinates.left
                    }px`,
                );
            }
        } else {
            popupEvent.deletePopup(dialog);
            dialog.close();
            AddChecklist.#clearForm();
        }
    };

    #resize = () => {
        window.requestAnimationFrame(() => {
            const dialog = this.parent.querySelector('#card-checklist');
            if (dialog.hasAttribute('open')) {
                const btnCoordinates = this.parent
                    .querySelector('button[data-action="manage-card-checklist"]')
                    .getBoundingClientRect();
                const dialogSizes = dialog.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                if (windowWidth - (btnCoordinates.left + dialogSizes.width) < 1) {
                    dialog.setAttribute(
                        'style',
                        `top: ${btnCoordinates.top + btnCoordinates.height + 10}px; left: ${
                            windowWidth - dialogSizes.width
                        }px`,
                    );
                } else {
                    dialog.setAttribute(
                        'style',
                        `top: ${btnCoordinates.top + btnCoordinates.height + 10}px; left: ${
                            btnCoordinates.left
                        }px`,
                    );
                }
            }
        });
    };

    static #clearForm = () => {
        const dialog = document.querySelector('#card-checklist');
        const form = dialog.querySelector('.form-add-card-checklist');
        form.reset();
    };

    #closePopupByBackground = (e) => {
        e.stopPropagation();

        if (e.target === e.currentTarget) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
            AddChecklist.#clearForm();
        }
    };

    #createChecklist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cardId = parseInt(this.parent.querySelector('#card').dataset.card, 10);
        const input = this.parent.querySelector('.input-card-checklist__input');
        const name = input.value;

        if (Validator.validateObjectName(name)) {
            await dispatcher.dispatch(
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

    static clearPopup = () => {
        popupEvent.closeOtherPopups([document.querySelector('#card')]);
        AddChecklist.#clearForm();
    };

    #blockButton = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const input = this.parent.querySelector('.input-card-checklist__input');
        const btnCreate = this.parent.querySelector('.btn-create-checklist');

        if (input.value.length === 0) {
            btnCreate.disabled = true;
        } else {
            btnCreate.disabled = false;
        }
    };

    #deleteChecklist = async (e) => {
        const checklist = e.target.closest('.card-information__checklist-wrapper');
        if (e.target.closest('.btn-delete-checklist')) {
            e.stopPropagation();
            e.preventDefault();

            const checklistId = parseInt(checklist.dataset.checklist, 10);
            await dispatcher.dispatch(actionDeleteChecklist({ id: checklistId }));
        }
    };

    #createChecklistItemShow = (e) => {
        const btn = e.target.closest('.btn-add-checklist-element');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();

            btn.style.display = 'none';
            btn.nextElementSibling.style.display = 'flex';
            btn.nextElementSibling.querySelector('.input-checklist-new-item__input').focus();
        }
    };

    #createChecklistItemClose = (e) => {
        const btn = e.target.closest('.btn-checklist-new-item_cancel');

        if (btn || e.key === 'Escape') {
            e.stopPropagation();
            e.preventDefault();
            this.#createChecklistItemCloseHelper(e);
        }
    };

    #createChecklistItemCloseHelper = (e) => {
        const input = e.target.closest('.checklist-new-item');
        input.querySelector('.input-checklist-new-item__input').value = '';
        input.style.display = 'none';
        input.previousElementSibling.style.display = 'flex';
    };

    #createChecklistItem = async (e) => {
        const btn = e.target.closest('.btn-checklist-new-item_save');

        if (btn || e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();
            const checklist = e.target.closest('.card-information__checklist-wrapper');
            const checklistId = parseInt(checklist.dataset.checklist, 10);
            const input = checklist.querySelector('.input-checklist-new-item__input');
            const name = input.value;

            if (Validator.validateObjectName(name)) {
                await dispatcher.dispatch(
                    actionCreateChecklistItem({
                        checklist_id: checklistId,
                        done: false,
                        list_position: workspaceStorage.getChecklistItems(checklistId).length,
                        name,
                    }),
                );
                this.#createChecklistItemCloseHelper(e);
            } else {
                NotificationMessage.showNotification(input, false, true, {
                    fontSize: 12,
                    fontWeight: 200,
                    text: 'Неккоректное название',
                });
            }
        }
    };

    #setCheckItemCheck = async (e) => {
        const input = e.target.closest('.input-checkitem__checkbox');

        if (input) {
            e.stopPropagation();

            const checklistItem = e.target.closest('.checkitem');
            const checklistItemId = parseInt(checklistItem.dataset.checkitem_id, 10);

            let check;
            if (input.hasAttribute('checked')) {
                input.removeAttribute('checked');
                input.checked = false;
                check = false;
            } else {
                input.setAttribute('checked', '');
                check = true;
            }

            await dispatcher.dispatch(
                actionUpdateChecklistItem({
                    done: check,
                    id: checklistItemId,
                    list_position: workspaceStorage.getChecklistItems(
                        parseInt(checklistItem.dataset.checklist_id, 10),
                    ).length,
                    name: checklistItem.querySelector('.checkitem-name__text').textContent,
                }),
            );
        }
    };

    #deleteCheckItem = async (e) => {
        const btn = e.target.closest('.btn-checkitem_delete');

        if (btn) {
            e.stopPropagation();
            e.preventDefault();

            const checklist = e.target.closest('.checkitem');
            const checklistItemId = parseInt(checklist.dataset.checkitem_id, 10);
            await dispatcher.dispatch(actionDeleteChecklistItem({ id: checklistItemId }));
        }
    };

    static addChecklist = (checklist) => {
        const dialog = document.querySelector('#card');

        if (!dialog.querySelector('.card-information__checklists')) {
            const description = document.querySelector('.card-information__description-wrapper');
            description.insertAdjacentHTML('afterend', new ChecklistsContainer(null, {}).render());
        }

        const checklistsLocation = dialog.querySelector('.card-information__checklists');

        checklistsLocation.insertAdjacentHTML(
            'afterbegin',
            new Checklist(null, {
                id: checklist.id,
                name: checklist.name,
                checklistItems: [],
            }).render(),
        );
    };

    static deleteChecklist = (checklistId) => {
        const dialog = document.querySelector('#card');
        const checklistContainer = dialog.querySelector('.card-information__checklists');
        const checklistObject = checklistContainer.querySelector(
            `.card-information__checklist-wrapper[data-checklist="${checklistId}"]`,
        );

        checklistObject.remove();

        if (!checklistContainer.childElementCount) {
            document.querySelector('.card-information__checklists').remove();
        }
    };

    static addCheckItem = (checkItem) => {
        const dialog = document.querySelector('#card');
        const checklist = dialog.querySelector(
            `.card-information__checklist-wrapper[data-checklist="${checkItem.checklist_id}"]`,
        );
        const checklistItemsContainer = checklist.querySelector('.card-information__checkitems');

        if (!checklistItemsContainer.childElementCount) {
            checklistItemsContainer.setAttribute('style', 'display: flex');
        }

        checklistItemsContainer.insertAdjacentHTML(
            'beforeend',
            new CheckItem(null, checkItem).render(),
        );
    };

    static deleteCheckItem = (checkItemId) => {
        const dialog = document.querySelector('#card');
        const checklistItemsObject = dialog.querySelector(
            `.checkitem[data-checkitem_id="${checkItemId}"]`,
        );
        const checklistItemsContainer = checklistItemsObject.parentElement;

        checklistItemsObject.remove();

        if (!checklistItemsContainer.childElementCount) {
            checklistItemsContainer.setAttribute('style', 'display: none');
        }
    };

    #proccessKeydownWithChecklist = (e) => {
        e.stopPropagation();
        const checklistName = e.target.closest('.input-checklist-new-item__input');

        if (checklistName) {
            e.stopPropagation();
            if (e.key === 'Enter') {
                e.preventDefault();
                this.#createChecklistItem(e);
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                this.#createChecklistItemClose(e);
            }
        }
    };
}
