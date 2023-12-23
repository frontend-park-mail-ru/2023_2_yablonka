import { actionCreateTag } from '../../../../actions/boardActions.js';
import dispatcher from '../../../../modules/dispatcher.js';
import Validator from '../../../../modules/validator.js';
import workspaceStorage from '../../../../storages/workspaceStorage.js';
import NotificationMessage from '../../../Common/notification/notificationMessage.js';
import Component from '../../../core/basicComponent.js';
import popupEvent from '../../../core/popeventProcessing.js';
import template from './createTag.hbs';
import './createTag.scss';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class CreateTag extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        this.parent.querySelector('#card').addEventListener('click', this.#openPopup);
        this.parent
            .querySelector('#create-tag')
            .addEventListener('click', this.#closePopupByBackground);
        this.parent
            .querySelector('.btn-create-tag')
            .addEventListener('click', this.#createTag);
        this.parent
            .querySelector('.input-card-checklist__input')
            .addEventListener('input', this.#blockButton);
    }

    removeEventListeners() {
        this.parent.querySelector('#card').removeEventListener('click', this.#openPopup);
        this.parent
            .querySelector('#create-tag')
            .removeEventListener('click', this.#closePopupByBackground);
        this.parent
            .querySelector('.btn-create-tag')
            .removeEventListener('click', this.#createTag);
        this.parent
            .querySelector('.input-card-checklist__input')
            .removeEventListener('input', this.#blockButton);
    }

    #openPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#create-tag');
        const btn = e.target.closest('.btn-add-new-tag');

        if (!dialog.hasAttribute('open')) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
            popupEvent.addPopup(dialog);
            dialog.showModal();

            const btnSizes = btn.getBoundingClientRect();
            const dialogSizes = dialog.getBoundingClientRect();
            dialog.setAttribute(
                'style',
                `top: ${Math.floor(btnSizes.top - dialogSizes.height / 4)}px; left: ${
                    btnSizes.left + btnSizes.width + 20
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

    #createTag = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cardId = parseInt(this.parent.querySelector('#card').dataset.card, 10);
        const input = this.parent.querySelector('.input-card-tag__input');
        const name = input.value;

        if (Validator.validateObjectName(name)) {
            await dispatcher.dispatch(
                actionCreateTag({
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

        const input = this.parent.querySelector('.input-card-tag__input');
        const btnCreate = this.parent.querySelector('.btn-create-tag');

        if (input.value.length === 0) {
            btnCreate.disabled = true;
        } else {
            btnCreate.disabled = false;
        }
    };
}
