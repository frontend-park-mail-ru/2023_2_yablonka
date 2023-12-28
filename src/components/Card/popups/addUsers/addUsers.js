import { actionAddUserCard, actionRemoveUserCard } from '../../../../actions/boardActions.js';
import dispatcher from '../../../../modules/dispatcher.js';
import workspaceStorage from '../../../../storages/workspaceStorage.js';
import Component from '../../../core/basicComponent.js';
import popupEvent from '../../../core/popeventProcessing.js';
import BoardUser from '../../atomic/boardUser/boardUser.js';
import template from './addUsers.hbs';
import './addUsers.scss';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class AddCardUsers extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        this.parent
            .querySelector('button[data-action=manage-card-users]')
            .addEventListener('click', this.#openPopup);
        this.parent
            .querySelector('#add-card-user')
            .addEventListener('click', this.#closePopupByBackground);
        this.parent.querySelector('#add-card-user').addEventListener('keydown', this.#proccessEnter);
        this.parent
            .querySelector('.input-add-card-user__search')
            .addEventListener('input', this.#searchUsers);
        this.parent
            .querySelector('.add-card-user__content')
            .addEventListener('click', this.#selectUsers);
        window.addEventListener('resize', this.#resize);
    }

    removeEventListeners() {
        this.parent
            .querySelector('button[data-action=manage-card-users]')
            .removeEventListener('click', this.#openPopup);
        this.parent
            .querySelector('#add-card-user')
            .removeEventListener('click', this.#closePopupByBackground);
        this.parent
            .querySelector('#add-card-user')
            .removeEventListener('keydown', this.#proccessEnter);
        this.parent
            .querySelector('.input-add-card-user__search')
            .removeEventListener('input', this.#searchUsers);
        window.removeEventListener('resize', this.#resize);
    }

    #proccessEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    #openPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#add-card-user');
        const btnCoordinates = e.target.closest('button').getBoundingClientRect();

        if (!dialog.hasAttribute('open')) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
            popupEvent.addPopup(dialog);
            dialog.showModal();
            this.#searchUsers();
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
            this.#clearForm();
        }
    };

    #resize = () => {
        window.requestAnimationFrame(() => {
            const dialog = this.parent.querySelector('#add-card-user');
            if (dialog.hasAttribute('open')) {
                const btnCoordinates = this.parent
                    .querySelector('button[data-action="manage-card-users"]')
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

    #closePopupByBackground = (e) => {
        e.stopPropagation();

        if (e.target === e.currentTarget) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
            this.#clearForm();
        }
    };

    #searchUsers = (e) => {
        let query;
        if (e) {
            e.stopPropagation();
            query = e.target.value;
        } else {
            query = '';
        }
        const searchedUsers = workspaceStorage.searchUsers(query);
        const dialog = this.parent.querySelector('#card');
        const usersContainer = this.parent.querySelector('.add-card-user__users');

        usersContainer.innerHTML = '';
        searchedUsers.forEach((user) => {
            usersContainer.insertAdjacentHTML(
                'beforeend',
                new BoardUser(null, {
                    avatar: user.avatar_url,
                    id: user.user_id,
                    email: user.email,
                    inCard: workspaceStorage
                        .getCardUsers(parseInt(dialog.dataset.card, 10))
                        .includes(user),
                }).render(),
            );
        });
    };

    #selectUsers = async (e) => {
        e.stopPropagation();

        const input = e.target;
        if (input.tagName === 'INPUT' && input.type === 'checkbox') {
            const userEmail = input.nextElementSibling.querySelector(
                '.add-card-user__user-email',
            ).textContent;
            const cardId = this.parent.querySelector('#card').dataset.card;
            if (input.hasAttribute('checked')) {
                input.removeAttribute('checked');
                input.checked = false;
                await dispatcher.dispatch(
                    actionRemoveUserCard({
                        user_id: workspaceStorage.getUserByEmail(userEmail).user_id,
                        task_id: parseInt(cardId, 10),
                    }),
                );
            } else {
                input.setAttribute('checked', '');
                await dispatcher.dispatch(
                    actionAddUserCard({
                        user_id: workspaceStorage.getUserByEmail(userEmail).user_id,
                        task_id: parseInt(cardId, 10),
                    }),
                );
            }
        }
    };

    #clearForm = () => {
        const dialog = this.parent.querySelector('#add-card-user');
        const form = dialog.querySelector('.form-add-card-user');
        form.reset();

        const users = dialog.querySelector('.add-card-user__users');
        users.innerHTML = '';
    };
}
