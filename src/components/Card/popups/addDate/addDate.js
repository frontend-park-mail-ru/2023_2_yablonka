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
export default class WorkspaceSettings extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        this.parent
            .querySelector('span[data-action=manage-card-data]')
            .addEventListener('click', this.#openPopup);
        this.parent.querySelector('#card-date').addEventListener('click', this.#closePopup);
    }

    removeEventListeners() {
        this.parent
            .querySelector('span[data-action=manage-card-data]')
            .removeEventListener('click', this.#openPopup);
        this.parent.querySelector('#card-date').removeEventListener('click', this.#closePopup);
    }

    #openPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cardId = parseInt(this.root.querySelector('#card').dataset.card, 10);
        const dialog = this.root.querySelector('#card-date');
        const btnCoordinates = e.target.closest('button').getBoundingClientRect();
        const dialogSizes = dialog.getBoundingClientRect();

        if (cardId) {
            const card = workspaceStorage.getCardById(cardId);
            dialog.querySelector('.start-date__checkbox').checked = card.start !== null;
            dialog.querySelector('.end-date__checkbox').checked = card.end !== null;

            dialog.querySelector('.start-date__date').value = card.start ? card.start : '';
            dialog.querySelector('.end-date__date').value = card.end ? card.end : '';
        }

        if (dialog.getAttribute('open') === null) {
            popupEvent.addPopup(dialog);
            dialog.show();
            dialog.setAttribute(
                'style',
                `top: ${btnCoordinates.y + Math.floor(dialogSizes.height / 2)}px; left: ${
                    btnCoordinates.x + btnCoordinates.width + 20
                }px`,
            );
        }
    };

    #closePopup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.root.querySelector('#card-date');

        if (dialog.getAttribute('open') !== null && !e.target.closest(dialog)) {
            popupEvent.deletePopup(dialog);
            dialog.close();
        }
    };
}
