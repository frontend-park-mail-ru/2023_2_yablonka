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
        this.#resizeBoardNameInput();
        this.parent.insertAdjacentHTML(
            'beforeend',
            template({
                ID: this.config.board_id,
                isOwner: workspaceStorage.isOwner(this.config.user_id),
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
            .querySelector('.input-board-name__input')
            .addEventListener('change', this.#changeBoardName);
        this.parent
            .querySelector('.input-board-name__input')
            .addEventListener('input', this.#resizeBoardNameInput);
        this.parent
            .querySelector('.input-board-name__input')
            .addEventListener('focus', this.#changeBackgoundBoardNameInput);
        this.parent
            .querySelector('.input-board-name__input')
            .addEventListener('blur', this.#changeBackgoundBoardNameInput);
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
            .querySelector('.input-board-name__input')
            .removeEventListener('change', this.#changeBoardName);
        this.parent
            .querySelector('.input-board-name__input')
            .removeEventListener('input', this.#resizeBoardNameInput);
        this.parent
            .querySelector('.input-board-name__input')
            .removeEventListener('focus', this.#changeBackgoundBoardNameInput);
        this.parent
            .querySelector('.input-board-name__input')
            .removeEventListener('blur', this.#changeBackgoundBoardNameInput);

        window.addEventListener('resize', this.#resize);
    }

    #renameBoard = () => {
        const dialog = this.parent.querySelector('#board-settings');

        const boardName = this.parent.querySelector('.board-menu__board-name');
        boardName.focus();

        popupEvent.deletePopup(dialog);
        dialog.close();
    };

    #openSettings = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#board-settings');

        const btnCoordinates = e.target.closest('button').getBoundingClientRect();

        if (dialog.getAttribute('open') === null) {
            popupEvent.closeAllPopups();
            popupEvent.addPopup(dialog);
            dialog.show();
            dialog.setAttribute(
                'style',
                `top: ${btnCoordinates.top + 50}px; left: ${btnCoordinates.right - 200}px`,
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
            `top: ${btnCoordinates.top + 50}px; left: ${btnCoordinates.right - 200}px`,
        );
    };

    #resizeBoardNameInput = (e) => {
        if (e?.type === 'input' || !e) {
            let input;
            if (e) {
                e.stopPropagation();
                input = e.target;
            } else {
                input = this.parent.querySelector('.input-board-name__input');
            }
            const letters = Array.from(input.value);
            const numbers = letters.filter((el) => /\d/.test(el));
            const characters = letters.filter((el) => !/\d/.test(el));

            const width = Math.floor(numbers.length * 12.5 + characters.length * 10.5) + 20;
            const maxWidth = Math.floor(
                this.parent.querySelector('.board-menu__team').getBoundingClientRect().left -
                    input.getBoundingClientRect().left,
            );
            input.parentElement.setAttribute(
                'style',
                `max-width: ${width < maxWidth ? width : maxWidth}px`,
            );
        }
    };

    #changeBackgoundBoardNameInput = (e) => {
        e.stopPropagation();

        if (e.type === 'focus' || e.type === 'blur') {
            const wrapper = e.target.parentElement;

            if (wrapper.dataset.active === 'false') {
                wrapper.dataset.active = 'true';
                wrapper.classList.add('board-name__input-wrapper_active');
            } else {
                wrapper.dataset.active = 'false';
                wrapper.classList.remove('board-name__input-wrapper_active');
            }
        }
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
        e.stopPropagation();
        e.preventDefault();

        const input = e.target.closest('.input-board-name__input');
        const boardId = input.dataset.board;
        const { name } = workspaceStorage.getBoardById(parseInt(boardId, 10));

        const { value } = e.target;

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
        }
        input.focus();
        input.blur();
    };
}
