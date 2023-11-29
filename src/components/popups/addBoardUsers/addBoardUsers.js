import { actionAddUserBoard } from '../../../actions/boardActions.js';
import dispatcher from '../../../modules/dispatcher.js';
import Validator from '../../../modules/validator.js';
import NotificationMessage from '../../Common/notification/notificationMessage.js';
import Component from '../../core/basicComponent.js';
import popupEvent from '../../core/popeventProcessing.js';
import template from './addBoardUsers.hbs';
import './addBoardUsers.scss';
/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class AddBoardUsers extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template({}));
    }

    addEventListeners() {
        this.parent
            .querySelector('.btn-share-action')
            .addEventListener('click', this.#openAddUserPopup);
        this.parent
            .querySelector('.btn-add-board-user_add')
            .addEventListener('click', this.#manageUser);
        this.parent
            .querySelector('.btn-add-board-user_delete')
            .addEventListener('click', this.#manageUser);
        this.parent
            .querySelector('.input-add-board-user-content__input')
            .addEventListener('input', this.#blockButton);
    }

    removeEventListeners() {
        this.parent
            .querySelector('.btn-share-action')
            .removeEventListener('click', this.#openAddUserPopup);
        this.parent
            .querySelector('.btn-add-board-user_add')
            .removeEventListener('click', this.#manageUser);
        this.parent
            .querySelector('.btn-add-board-user_delete')
            .removeEventListener('click', this.#manageUser);
        this.parent
            .querySelector('.input-add-board-user-content__input')
            .removeEventListener('input', this.#blockButton);
    }

    #openAddUserPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#add-board-user');

        const btnCoordinates = e.target.closest('button').getBoundingClientRect();

        if (dialog.getAttribute('open') === null) {
            popupEvent.closeAllPopups();
            popupEvent.addPopup(dialog);
            dialog.show();
            dialog.setAttribute(
                'style',
                `top: ${btnCoordinates.top + 50}px; left: ${btnCoordinates.left - 100}px`,
            );
        } else {
            popupEvent.deletePopup(dialog);
            dialog.close();
        }
    };

    #blockButton = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const input = this.parent.querySelector('.input-add-board-user-content__input');
        const btnAdd = this.parent.querySelector('.btn-add-board-user_add');
        const btnDelete = this.parent.querySelector('.btn-add-board-user_delete');

        if (e.target.value.length === 0) {
            btnAdd.disabled = true;
            btnDelete.disabled = true;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--need-text-color)');
        } else {
            btnAdd.disabled = false;
            btnDelete.disabled = false;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--main-btn-border-color)');
        }
    };

    #manageUser = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { action } = e.target.closest('button').dataset;
        const email = this.parent.querySelector('.input-add-board-user-content__input');
        const userEmail = email.value;

        if (Validator.validateObjectName(userEmail.value)) {
            popupEvent.closeAllPopups();
            if (action === 'add-user') {
                dispatcher.dispatch(
                    actionAddUserBoard({
                        user_email: userEmail,
                        board_id: parseInt(
                            this.parent.querySelector('.board-menu__board-name').dataset.board,
                            10,
                        ),
                    }),
                );
            } else {
                // dispatcher.dispatch(
                //     actionRemoveUser({
                //         user_email: userEmail,
                //         board_id: parseInt(
                //             this.parent.querySelector('.board-menu__board-name').dataset.board,
                //             10,
                //         ),
                //     }),
                // );
            }
        } else {
            NotificationMessage.showNotification(email, true, true, {
                fontSize: 12,
                fontWeight: 200,
                text: 'Неккоректный email',
            });
        }
    };
}
