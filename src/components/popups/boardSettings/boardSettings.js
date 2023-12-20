import { actionDeleteBoard, actionUpdateBoard } from '../../../actions/boardActions.js';
import { actionRedirect } from '../../../actions/userActions.js';
import dispatcher from '../../../modules/dispatcher.js';
import workspaceStorage from '../../../storages/workspaceStorage.js';
import Component from '../../core/basicComponent.js';
import popupEvent from '../../core/popeventProcessing.js';
import template from './boardSettings.hbs';
import './boardSettings.scss';
/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class BoardSettings extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML(
            'beforeend',
            template({
                ID: this.config.board_id,
                isOwner: this.config.is_owner,
            }),
        );
    }

    addEventListeners() {
        this.parent
            .querySelector('.btn-board-settings')
            .addEventListener('click', this.#openSettings);
        this.parent
            .querySelector('.btn-change-board-name')
            .addEventListener('click', this.#renameBoard);
        this.parent
            .querySelector('.btn-delete-board')
            ?.addEventListener('click', this.#deleteBoard);
        this.parent
            .querySelector('.board-name__input')
            .addEventListener('blur', this.#changeBoardName);
        this.parent
            .querySelector('.board-name__input')
            .addEventListener('keydown', this.#enterButtonHandler);
        window.addEventListener('resize', BoardSettings.resizeBoardNameInput);
        window.addEventListener('resize', this.#resize);
    }

    removeEventListeners() {
        this.parent
            .querySelector('.btn-board-settings')
            .removeEventListener('click', this.#openSettings);
        this.parent
            .querySelector('.btn-change-board-name')
            .removeEventListener('click', this.#renameBoard);
        this.parent
            .querySelector('.btn-delete-board')
            ?.removeEventListener('click', this.#deleteBoard);
        this.parent
            .querySelector('.board-name__input')
            .removeEventListener('blur', this.#changeBoardName);
        this.parent
            .querySelector('.board-name__input')
            .removeEventListener('keydown', this.#enterButtonHandler);
        window.removeEventListener('resize', BoardSettings.resizeBoardNameInput);
        window.removeEventListener('resize', this.#resize);
    }

    #renameBoard = () => {
        const dialog = this.parent.querySelector('#board-settings');

        const input = this.parent.querySelector('.board-name__input');
        input.focus();

        popupEvent.deletePopup(dialog);
        dialog.close();
    };

    #openSettings = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#board-settings');

        const btn = e.target.closest('button');
        const btnCoordinates = btn.getBoundingClientRect();

        if (dialog.getAttribute('open') === null) {
            popupEvent.closeAllPopups();
            popupEvent.addPopup(dialog);
            dialog.show();
            dialog.setAttribute(
                'style',
                `top: ${btnCoordinates.top - 20}px; left: ${btnCoordinates.left + 60}px`,
            );
        } else {
            popupEvent.deletePopup(dialog);
            dialog.close();
        }
    };

    #resize = () => {
        const dialog = this.parent.querySelector('#board-settings');

        const btnCoordinates = this.parent
            .querySelector('.btn-board-settings')
            .getBoundingClientRect();
        dialog.setAttribute(
            'style',
            `top: ${btnCoordinates.top - 20}px; left: ${btnCoordinates.left + 60}px`,
        );
    };

    #enterButtonHandler = (e) => {
        e.stopPropagation();

        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
        }
    };

    static resizeBoardNameInput = () => {
        window.requestAnimationFrame(() => {
            const input = document.querySelector('.board-name__input');
            const maxWidth = Math.floor(
                document.querySelector('.board-menu__team').getBoundingClientRect().left -
                    input.getBoundingClientRect().left,
            );
            input.parentElement.setAttribute('style', `max-width: ${maxWidth}px`);
        });
    };

    #deleteBoard = () => {
        const dialog = this.parent.querySelector('#board-settings');

        if (dialog.dataset.board) {
            const boardId = parseInt(dialog.dataset.board, 10);
            popupEvent.deletePopup(dialog);
            dialog.close();

            dispatcher.dispatch(actionDeleteBoard(parseInt(boardId, 10)));
            dispatcher.dispatch(actionRedirect('/main', true));
        }
    };

    #changeBoardName = async (e) => {
        if (e.target.closest('.board-name__input')) {
            e.stopPropagation();
            e.preventDefault();

            const input = e.target.closest('.board-name__input');
            const boardId = input.dataset.board;
            const { name } = workspaceStorage.getBoardById(parseInt(boardId, 10));

            const value = input.textContent;

            if (value !== '' && value !== name) {
                await dispatcher.dispatch(
                    actionUpdateBoard({
                        id: parseInt(boardId, 10),
                        name: value.slice(0, 33),
                    }),
                );
                e.target.value = value;
            } else {
                e.target.value = name;
                BoardSettings.resizeBoardNameInput();
            }
        }
    };
}
