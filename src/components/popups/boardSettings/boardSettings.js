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
        this.parent.insertAdjacentHTML('beforeend', template({ boardID: this.config.board_id }));
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
            .addEventListener('click', this.deleteBoardHandler);
        this.parent
            .querySelector('.board-menu__board-name')
            .addEventListener('blur', this.changeNameHandler);
        this.parent
            .querySelector('.board-menu__board-name')
            .addEventListener('keydown', this.changeNameHandler);
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
            .removeEventListener('click', this.deleteBoardHandler);
        this.parent
            .querySelector('.board-menu__board-name')
            .removeEventListener('blur', this.changeNameHandler);
        this.parent
            .querySelector('.board-menu__board-name')
            .removeEventListener('keydown', this.changeNameHandler);
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

        if (dialog.getAttribute('open') !== null) {
            popupEvent.deletePopup(dialog);
            dialog.close();
        } else {
            popupEvent.addPopup(dialog);
            dialog.show();
            popupEvent.closeOtherPopups(dialog);
            dialog.setAttribute(
                'style',
                `top: ${btnCoordinates.top + 50}px; left: ${btnCoordinates.right - 200}px`,
            );
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

    deleteBoardHandler = () => {
        const dialog = this.parent.querySelector('#board-settings');
        if (dialog.dataset.board) {
            const boardId = dialog.dataset.board;
            popupEvent.deletePopup(dialog);
            dialog.close();
            dispatcher.dispatch(actionDeleteBoard(boardId));
            dispatcher.dispatch(actionRedirect('/main', true));
        }
    };

    changeNameHandler = (e) => {
        e.stopPropagation();

        const { textContent } = e.target;

        if (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter')) {
            const boardId = this.parent.querySelector('#board-settings').dataset.board;
            const { name } = workspaceStorage.getBoardById(parseInt(boardId, 10));

            e.target.blur();

            if (textContent !== '' && textContent !== name) {
                dispatcher.dispatch(
                    actionUpdateBoard({
                        id: parseInt(boardId, 10),
                        name: textContent,
                    }),
                );
            } else {
                e.target.textContent = name;
            }
        }
    };
}