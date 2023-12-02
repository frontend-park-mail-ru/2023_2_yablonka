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
    actionDeleteChecklist,
    actionUpdateCard,
} from '../../actions/boardActions.js';
import dispatcher from '../../modules/dispatcher.js';
import { actionNavigate } from '../../actions/userActions.js';
import Comments from './atomic/comments/comments.js';
import userStorage from '../../storages/userStorage.js';
import CardDate from './atomic/date/cardDate.js';
import Validator from '../../modules/validator.js';
import NotificationMessage from '../Common/notification/notificationMessage.js';
import CardUser from './atomic/cardUser/cardUser.js';
import Checklist from './atomic/checklist/checklist.js';
import CheckItem from './atomic/checkItem/checkItem.js';

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
        dialog.querySelector('.card-information__card-description').value = card.description;

        Card.#addComments(parseInt(dialog.dataset.card, 10));
        Card.#addDate(parseInt(dialog.dataset.card, 10));
        Card.addUsers(parseInt(dialog.dataset.card, 10));
        Card.#addChecklists(parseInt(dialog.dataset.card, 10));

        if (dialog.getAttribute('open') === null) {
            popupEvent.addPopup(dialog);
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
        dialog.querySelector('.card-information__card-description').value = card.description;

        Card.#addComments(parseInt(dialog.dataset.card, 10));
        Card.#addDate(parseInt(dialog.dataset.card, 10));
        Card.addUsers(parseInt(dialog.dataset.card, 10));
        Card.#addChecklists(parseInt(dialog.dataset.card, 10));

        if (dialog.getAttribute('open') === null) {
            popupEvent.closeAllPopups();
            popupEvent.addPopup(dialog);
            dialog.showModal();
            Card.updateHistory(card.id);
        }
    };

    #closeCardByBtn = (e) => {
        e.preventDefault();
        e.stopPropagation();

        popupEvent.closeAllPopups();
        Card.updateHistory();
    };

    #closeCardByBackground = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.target === e.currentTarget) {
            popupEvent.closeAllPopups();
            Card.updateHistory();
        }
        popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
    };

    #deleteCard = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cardId = e.target.closest('dialog')?.dataset.card;

        if (cardId) {
            Card.updateHistory();
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
                    start: card.start,
                    end: card.end,
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
            dialog.querySelector('.card-information__add-comment-text').value = '';
            const userId = userStorage.storage.get(userStorage.userModel.body).body.user.user_id;
            if (Validator.validateObjectName(comment)) {
                dispatcher.dispatch(
                    actionCommentCard({
                        task_id: parseInt(dialog.dataset.card, 10),
                        user_id: userId,
                        text: comment,
                    }),
                );
            } else {
                NotificationMessage.showNotification(
                    this.parent.querySelector('.card-information__add-comment').parentNode,
                    false,
                    true,
                    {
                        fontSize: 14,
                        fontWeight: 200,
                        text: 'Неккоректное сообщение',
                    },
                );
            }
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

    static updateHistory = (cardId) => {
        if (cardId) {
            dispatcher.dispatch(
                actionNavigate(
                    `${
                        window.location.pathname.match(/^\/workspace_\d+_board_\d+/)[0]
                    }_card_${cardId}`,
                    '',
                    false,
                ),
            );
        } else {
            dispatcher.dispatch(
                actionNavigate(
                    window.location.pathname.match(/^\/workspace_\d+_board_\d+/)[0],
                    '',
                    false,
                ),
            );
        }
    };

    static #getComments = (cardId) => {
        const cardComments = workspaceStorage.getCardComments(parseInt(cardId, 10));
        const comments = [];

        cardComments.forEach((comment) => {
            const user = workspaceStorage.getUserById(comment.user_id);
            comments.push(
                new Comments(null, {
                    avatar: user.avatar_url,
                    email: user.email,
                    comment: comment.text,
                }).render(),
            );
        });
        return comments;
    };

    static #addComments = (cardId) => {
        const dialog = document.querySelector('#card');
        const commentsLocation = dialog.querySelector('.card-information__users-comments');
        commentsLocation.innerHTML = '';

        this.#getComments(cardId)
            .reverse()
            .forEach((cmt) => {
                commentsLocation.insertAdjacentHTML('beforeend', cmt);
            });
    };

    static #addDate = (cardId) => {
        const dialog = document.querySelector('#card');
        const dateLocation = dialog.querySelector('.card-information__date-wrapper');
        dateLocation.innerHTML = '';

        const date = new CardDate(null, { id: cardId }).render();

        dateLocation.insertAdjacentHTML('beforeend', date);
    };

    static addUsers = (cardId) => {
        const dialog = document.querySelector('#card');
        const usersLocation = dialog.querySelector('.card-information__users-wrapper');
        usersLocation.innerHTML = '';

        const users = workspaceStorage.getCardUsers(parseInt(cardId, 10));
        
        const overflow = users.length - 3;
        users.slice(0, 3).forEach((user) => {
            usersLocation.insertAdjacentHTML(
                'beforeend',
                new CardUser(null, {
                    avatar: user.avatar_url,
                    user: user.user_id,
                }).render(),
            );
        });
        if (overflow > 0) {
            const message = document.createElement('span');

            message.classList.add(
                ...'font-size-16 font-weight-500 card-information__user-overflow'.split(' '),
            );
            message.textContent = `+${overflow}`;
            usersLocation.appendChild(message);
        }
    };

    static #addChecklists = (cardId) => {
        const dialog = document.querySelector('#card');
        const checklistsLocation = dialog.querySelector('.card-information__checklists');
        const checklists = workspaceStorage.getCardChecklists(parseInt(cardId, 10));

        if (checklists.length) {
            checklistsLocation.style.display = 'flex';
            checklistsLocation.innerHTML = '';
            checklists.forEach((checklist) => {
                checklistsLocation.insertAdjacentHTML(
                    'beforeend',
                    new Checklist(null, {
                        id: checklist.id,
                        name: checklist.name,
                        checklistItems: Card.#getChecklistItems(checklist.id),
                    }).render(),
                );
            });
        }
        dialog.querySelectorAll('.card-information__checkitems')?.forEach((items) => {
            if (items.children.length) {
                items.setAttribute('style', 'display: flex');
            }
        });
    };

    static #getChecklistItems = (checklistId) => {
        const items = [];
        const checklistItems = workspaceStorage.getChecklistItems(checklistId);

        checklistItems.forEach((item) => {
            items.push(
                new CheckItem(null, {
                    id: item.id,
                    checklist_id: item.checklist_id,
                    name: item.name,
                    done: item.done,
                }).render(),
            );
        });
        return items;
    };
}
