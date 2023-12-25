import Component from '../../core/basicComponent.js';
import template from './createBoard.hbs';
import dispatcher from '../../../modules/dispatcher.js';
import { actionCreateBoard } from '../../../actions/boardActions.js';
import './createBoard.scss';
import NotificationMessage from '../../Common/notification/notificationMessage.js';
import Validator from '../../../modules/validator.js';
import popupEvent from '../../core/popeventProcessing.js';
/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class CreateBoard extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        this.parent.querySelector('.container-main')?.addEventListener('click', this.#openCreateBoard);
        this.parent.querySelector('.container-board')?.addEventListener('click', this.#openCreateBoard);
        this.parent
            .querySelector('input[data-name=board-name]')
            .addEventListener('input', this.#blockCreateButton);
        this.parent
            .querySelector('.btn-create-board-pop-up')
            .addEventListener('click', this.#createBoard);
        window.addEventListener('resize', this.#resize);
    }

    removeEventListeners() {
        this.parent.querySelector('.container-main')?.removeEventListener('click', this.#openCreateBoard);
        this.parent.querySelector('.container-board')?.removeEventListener('click', this.#openCreateBoard);        this.parent
            .querySelector('input[data-name=board-name')
            .removeEventListener('input', this.#blockCreateButton);
        this.parent
            .querySelector('.btn-create-board-pop-up')
            .removeEventListener('click', this.#createBoard);
        window.removeEventListener('resize', this.#resize);
    }

    #blockCreateButton = (e) => {
        e.preventDefault();

        if (e.target.value.length === 0) {
            this.parent.querySelector('.btn-create-board-pop-up').disabled = true;
        } else {
            this.parent.querySelector('.btn-create-board-pop-up').disabled = false;
        }
    };

    #openCreateBoard = (e) => {
        if (e.target.closest('.btn-create-board')) {
            e.preventDefault();
            e.stopPropagation();

            const dialog = this.parent.querySelector('#create-board');

            const btn = e.target.closest('.btn-create-board');
            const btnCoordinates = btn.getBoundingClientRect();
            const workspaceId = btn.dataset.workspace;

            if (!dialog.hasAttribute('open')) {
                popupEvent.closeAllPopups();
                popupEvent.addPopup(dialog);
                dialog.show();

                dialog.setAttribute(
                    'style',
                    `top: ${btnCoordinates.top - 150}px; left: ${btnCoordinates.left + 50}px`,
                );
                dialog.setAttribute('data-workspace', workspaceId);
            } else {
                popupEvent.deletePopup(dialog);
                dialog.close();
                if (workspaceId !== dialog.dataset.workspace && workspaceId) {
                    popupEvent.closeAllPopups();
                    popupEvent.addPopup(dialog);
                    dialog.show();
                    dialog.setAttribute(
                        'style',
                        `top: ${btnCoordinates.top - 150}px; left: ${btnCoordinates.left + 50}px`,
                    );
                    dialog.setAttribute('data-workspace', workspaceId);
                    dialog.dataset.workspace = workspaceId;
                }
            }
        }
    };

    #createBoard = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        const dialog = this.parent.querySelector('#create-board');

        const boardName = this.parent.querySelector('input[data-name=board-name]');
        const workspaceID = e.target.closest('dialog').dataset.workspace;

        if (Validator.validateObjectName(boardName.value)) {
            popupEvent.deletePopup(dialog);
            dialog.close();

            await dispatcher.dispatch(
                actionCreateBoard({
                    name: boardName.value,
                    workspace_id: parseInt(workspaceID, 10),
                }),
            );
        } else {
            NotificationMessage.showNotification(boardName, true, true, {
                fontSize: 14,
                fontWeight: 200,
                text: 'Неккоректное название доски',
            });
        }
    };

    #resize = () => {
        const dialog = this.parent.querySelector('#create-board');

        if (dialog.dataset.workspace) {
            const btnCoordinates = this.parent
                .querySelector(`.btn-create-board[data-workspace="${dialog.dataset.workspace}"]`)
                .getBoundingClientRect();
            dialog.setAttribute(
                'style',
                `top: ${btnCoordinates.top - 150}px; left: ${btnCoordinates.left + 50}px`,
            );
        }
    };
}
