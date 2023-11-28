import Component from '../core/basicComponent.js';
import workspaceStorage from '../../storages/workspaceStorage.js';
import template from './card.hbs';
import './Card.scss';
import popupEvent from '../core/popeventProcessing.js';
import Sidebar from './sidebar/sidebar.js';
import CardContent from './cardContent/cardContent.js';
import { actionDeleteCard, actionUpdateCard } from '../../actions/boardActions.js';
import dispatcher from '../../modules/dispatcher.js';
import { actionNavigate } from '../../actions/userActions.js';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Card extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        const page = {
            cardContent: new CardContent(null, {
                avatar: this.config.avatar,
            }).render(),
            sidebar: new Sidebar(null, {}).render(),
        };
        this.parent.insertAdjacentHTML('beforeend', template(page));
    }

    addEventListeners() {
        this.parent.querySelectorAll('.list__card-wrapper').forEach((card) => {
            card.addEventListener('click', this.#openCard);
            card.addEventListener('click', this.#resize);
        });
        this.parent
            .querySelector('.btn-card-modal__exit-wrapper')
            .addEventListener('click', this.#closeCardByBtn);
        this.parent.querySelector('#card').addEventListener('click', this.#closeCardByBackground);
        this.parent.querySelectorAll('.list__card-wrapper').forEach((card) => {
            card.addEventListener('click', this.#openCard);
        });
        this.parent
            .querySelector('span[data-action=delete-card]')
            .addEventListener('click', this.#deleteCard);
        this.parent
            .querySelector('.card-information__card-description')
            .addEventListener('click', this.#changeDescription);
    }

    removeEventListeners() {
        this.parent.querySelectorAll('.list__card-wrapper').forEach((card) => {
            card.removeEventListener('click', this.#openCard);
            card.removeEventListener('click', this.#resize);
        });
        this.parent
            .querySelector('.btn-card-modal__exit-wrapper')
            .removeEventListener('click', this.#closeCardByBtn);
        this.parent
            .querySelector('#card')
            .removeEventListener('click', this.#closeCardByBackground);
        this.parent
            .querySelector('span[data-action=delete-card]')
            .removeEventListener('click', this.#deleteCard);
        this.parent
            .querySelector('.card-information__card-description')
            .removeEventListener('click', this.#changeDescription);
    }

    static openByRedirect = (id) => {
        const dialog = document.querySelector('#card');

        const card = workspaceStorage.getCardById(parseInt(id, 10));

        const list = workspaceStorage.getListById(card.list_id);

        dialog.dataset.card = card.id;

        dialog.querySelector('.card-information__card-name').textContent = card.name;
        dialog.querySelector('.card-information-list-name__title').textContent = list.name;
        dialog.querySelector('.card-description-title__card-name').textContent = card.name;
        dialog.querySelector('.card-information__card-description').value = card.description;

        if (dialog.getAttribute('open') === null) {
            popupEvent.addPopup(dialog);
            popupEvent.closeOtherPopups();

            dialog.showModal();

            const dialogSizes = dialog.getBoundingClientRect();
            const windowSizes = document.querySelector('.page').getBoundingClientRect();

            dialog.setAttribute(
                'style',
                `top: ${Math.floor(
                    (windowSizes.height - dialogSizes.height) / 2,
                )}px; left: ${Math.floor((windowSizes.width - dialogSizes.width) / 2)}px`,
            );
        }
    };

    #openCard = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#card');

        const card = workspaceStorage.getCardById(
            parseInt(e.target.closest('.list__card-wrapper').dataset.card, 10),
        );
        const list = workspaceStorage.getListById(
            parseInt(e.target.closest('.list').dataset.list, 10),
        );

        dialog.dataset.card = card.id;

        dialog.querySelector('.card-information__card-name').textContent = card.name;
        dialog.querySelector('.card-information-list-name__title').textContent = list.name;
        dialog.querySelector('.card-description-title__card-name').textContent = card.name;
        dialog.querySelector('.card-information__card-description').value = card.description;

        if (dialog.getAttribute('open') === null) {
            popupEvent.addPopup(dialog);
            popupEvent.closeOtherPopups();
            dialog.showModal();
        }
    };

    #closeCardByBtn = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#card');

        popupEvent.deletePopup(dialog);
        popupEvent.closeAllPopups();
        popupEvent.clearPopups();
        this.#updateHistory();
    };

    #closeCardByBackground = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#card');

        if (e.target === e.currentTarget) {
            popupEvent.deletePopup(dialog);
            popupEvent.closeAllPopups();
            popupEvent.clearPopups();
            this.#updateHistory();
        }
    };

    #deleteCard = (e) => {
        const cardId = e.target.closest('dialog')?.dataset.card;

        if (cardId) {
            dispatcher.dispatch(actionDeleteCard({ id: parseInt(cardId, 10) }));
        }
    };

    #changeDescription = (e) => {
        const description = e.target.closest('textarea').value;
        const cardId = e.target.closest('dialog')?.dataset.card;
        const card = workspaceStorage.getCardById(cardId);

        if (cardId) {
            dispatcher.dispatch(
                actionUpdateCard({
                    id: cardId,
                    name: card.name,
                    description,
                    start: '',
                    end: '',
                    list_position: card.list_position,
                }),
            );
        }
    };

    #resize = () => {
        const dialog = this.parent.querySelector('#card');

        const dialogSizes = dialog.getBoundingClientRect();
        const windowSizes = this.parent.getBoundingClientRect();

        dialog.setAttribute(
            'style',
            `top: ${Math.floor(
                (windowSizes.height - dialogSizes.height) / 2,
            )}px; left: ${Math.floor((windowSizes.width - dialogSizes.width) / 2)}px`,
        );
    };

    #updateHistory = () => {
        dispatcher.dispatch(
            actionNavigate(
                window.location.pathname.match(/^\/workspace_\d+_board_\d+/)[0],
                '',
                false,
            ),
        );
    };
}
