import Component from '../core/basicComponent.js';
import workspaceStorage from '../../storages/workspaceStorage.js';
import template from './card.hbs';
import './Card.scss';
import popupEvent from '../core/popeventProcessing.js';
import Sidebar from './sidebar/sidebar.js';
import CardContent from './cardContent/cardContent.js';
import {
    actionCommentCard,
    actionDeleteCard,
    actionUpdateCard,
} from '../../actions/boardActions.js';
import dispatcher from '../../modules/dispatcher.js';
import { actionNavigate } from '../../actions/userActions.js';
import Comments from './atomic/comments/comments.js';
import userStorage from '../../storages/userStorage.js';

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
            .querySelector('button[data-action=delete-card]')
            .addEventListener('click', this.#deleteCard);
        this.parent
            .querySelector('.card-information__card-description')
            .addEventListener('keydown', this.#changeNameAndDescription);
        this.parent
            .querySelector('.card-information__card-name')
            .addEventListener('keydown', this.#changeNameAndDescription);
        this.parent
            .querySelector('.card-information__add-comment-text')
            .addEventListener('keydown', this.#createComment);
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
            .querySelector('button[data-action=delete-card]')
            .removeEventListener('click', this.#deleteCard);
        this.parent
            .querySelector('.card-information__card-description')
            .removeEventListener('keydown', this.#changeNameAndDescription);
        this.parent
            .querySelector('.card-information__card-name')
            .removeEventListener('keydown', this.#changeNameAndDescription);
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
        Card.updateHistory();
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

        this.#addComments(parseInt(dialog.dataset.card, 10));

        if (dialog.getAttribute('open') === null) {
            popupEvent.closeAllPopups();
            popupEvent.addPopup(dialog);
            dialog.showModal();
        }
    };

    #closeCardByBtn = (e) => {
        e.preventDefault();
        e.stopPropagation();

        popupEvent.closeAllPopups();
    };

    #closeCardByBackground = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.target === e.currentTarget) {
            popupEvent.closeAllPopups();
        }

        popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
    };

    #deleteCard = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cardId = e.target.closest('dialog')?.dataset.card;

        if (cardId) {
            dispatcher.dispatch(actionDeleteCard({ id: parseInt(cardId, 10) }));
        }
    };

    #changeNameAndDescription = (e) => {
        e.stopPropagation();

        const dialog = this.parent.querySelector('#card');

        const name = dialog.querySelector('.card-information__card-name').textContent;
        const description = dialog.querySelector('.card-information__card-description').value;
        const cardId = parseInt(e.target.closest('dialog')?.dataset.card, 10);
        const card = workspaceStorage.getCardById(cardId, 10);

        if (cardId && e.key === 'Enter') {
            e.preventDefault();
            dispatcher.dispatch(
                actionNavigate(
                    `${
                        window.location.pathname.match(/^\/workspace_\d+_board_\d+/)[0]
                    }_card_${cardId}`,
                    '',
                    false,
                ),
            );
            dispatcher.dispatch(
                actionUpdateCard({
                    id: cardId,
                    name,
                    description,
                    list_position: parseInt(card.list_position, 10),
                }),
            );
        }
    };

    #createComment = (e) => {
        e.stopPropagation();

        if (e.key === 'Enter') {
            e.preventDefault();

            const dialog = this.parent.querySelector('#card');
            const comment = dialog.querySelector('.card-information__add-comment-text').value;
            const userId = userStorage.storage.get(userStorage.userModel.body).body.user.user_id;
            dispatcher.dispatch(
                actionCommentCard({
                    task_id: parseInt(dialog.dataset.card, 10),
                    user_id: userId,
                    text: comment,
                }),
            );
            this.#addComments(parseInt(dialog.dataset.card, 10));
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

    static updateHistory = () => {
        dispatcher.dispatch(
            actionNavigate(
                window.location.pathname.match(/^\/workspace_\d+_board_\d+/)[0],
                '',
                false,
            ),
        );
    };

    #addComments = (cardId) => {
        const commentsLocation = this.parent.querySelector('.card-information__users-comments');
        commentsLocation.innerHTML = '';

        const newComments = this.#getComments(cardId);

        newComments.forEach((cmt) => {
            commentsLocation.insertAdjacentHTML('afterend', cmt);
        });
    };

    #getComments = (cardId) => {
        const cardComments = workspaceStorage.getCardById(parseInt(cardId, 10)).comments || [];
        const comments = [];

        cardComments.forEach((comment) => {
            const user = workspaceStorage.getUserById(comment.user_id);
            comments.push(
                new Comments(null, {
                    avatar: user.avatar,
                    email: user.email,
                    comment: comment.text,
                }).render(),
            );
        });

        return comments;
    };
}
