import Component from '../core/basicComponent.js';
import template from './card.hbs';
import './card.scss';

import popupEvent from '../core/popeventProcessing.js';
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
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        this.parent.querySelectorAll('.btn-create-board').forEach((btn) => {
            btn.addEventListener('click', this.#openCreateBoard);
        });
        this.parent
            .querySelector('input[data-name=board-name]')
            .addEventListener('input', this.#blockCreateButton);
        this.parent
            .querySelector('.btn-create-board-pop-up')
            .addEventListener('click', this.#createBoard);
        window.addEventListener('resize', this.#resize);
    }

    removeEventListeners() {
        this.parent.querySelectorAll('.btn-create-board').forEach((btn) => {
            btn.removeEventListener('click', this.#openCreateBoard);
        });
        this.parent
            .querySelector('input[data-name=board-name')
            .removeEventListener('input', this.#blockCreateButton);
        this.parent
            .querySelector('.btn-create-board-pop-up')
            .removeEventListener('click', this.#createBoard);
        window.removeEventListener('resize', this.#resize);
    }

    #blockCreateButton = (e) => {
        e.preventDefault();
        const input = document.querySelector('input[data-name="board-name"');

        if (e.target.value.length === 0) {
            document.querySelector('.btn-create-board-pop-up').disabled = true;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--need-text-color');
        } else {
            document.querySelector('.btn-create-board-pop-up').disabled = false;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--main-btn-border-color');
        }
    };

    #openCreateBoard = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = document.querySelector('#create-board');

        const btnCoordinates = e.target.parentElement.getBoundingClientRect();
        const workspaceId = e.target.parentElement.dataset.workspace;

        if (dialog.getAttribute('open') !== null) {
            popupEvent.deletePopup(dialog);
            dialog.close();
            if (workspaceId !== dialog.dataset.workspace) {
                popupEvent.addPopup(dialog);
                dialog.show();
                popupEvent.closeOtherPopups(dialog);
                dialog.setAttribute(
                    'style',
                    `top: ${btnCoordinates.top - 120}px; left: ${
                        btnCoordinates.left + btnCoordinates.width + 30
                    }px`,
                );
                dialog.dataset.workspace = workspaceId;
            }
        } else {
            popupEvent.addPopup(dialog);
            dialog.show();
            popupEvent.closeOtherPopups(dialog);
            dialog.setAttribute(
                'style',
                `top: ${btnCoordinates.top - 120}px; left: ${
                    btnCoordinates.left + btnCoordinates.width + 30
                }px`,
            );
            dialog.setAttribute('data-workspace', workspaceId);
        }
    };

    #createBoard = (e) => {
        e.preventDefault();

        const dialog = document.querySelector('#create-board');

        const boardName = this.parent.querySelector('input[data-name=board-name]');
        const workspaceID = e.target.closest('dialog').dataset.workspace;

        if (Validator.validateObjectName(boardName.value)) {
            popupEvent.deletePopup(dialog);
            dialog.close();

            dispatcher.dispatch(
                actionCreateBoard({
                    name: boardName.value,
                    workspace_id: parseInt(workspaceID, 10),
                }),
            );
        } else {
            NotificationMessage.showNotification(boardName, true, true, {
                fontSize: 14,
                fontWeight: 200,
                text: 'Некорректное название доски',
            });
        }
    };

    #resize = () => {
        const dialog = document.querySelector('#create-board');

        if (dialog.dataset.workspace) {
            const btnCoordinates = document
                .querySelector(`.btn-create-board[data-workspace="${dialog.dataset.workspace}"]`)
                .getBoundingClientRect();
            dialog.setAttribute(
                'style',
                `top: ${btnCoordinates.top - 10}px; left: ${
                    btnCoordinates.left + btnCoordinates.width + 30
                }px`,
            );
        }
    };
}