import { actionGetHistory } from '../../../actions/boardActions.js';
import dispatcher from '../../../modules/dispatcher.js';
import userStorage from '../../../storages/userStorage.js';
import workspaceStorage from '../../../storages/workspaceStorage.js';
import Component from '../../core/basicComponent.js';
import popupEvent from '../../core/popeventProcessing.js';
import HistoryItem from './atomic/historyItem/historyItem.js';
import template from './boardHistory.hbs';
import './boardHistory.scss';
/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class BoardHistory extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template({}));
    }

    addEventListeners() {
        this.parent.querySelector('.btn-board-history').addEventListener('click', this.#openPopup);
        window.addEventListener('resize', this.#resize);
    }

    removeEventListeners() {
        this.parent
            .querySelector('.btn-board-history')
            .removeEventListener('click', this.#openPopup);
        window.removeEventListener('resize', this.#resize);
    }

    #openPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#board-history');
        const btn = e.target.closest('.btn-board-history');

        if (!dialog.hasAttribute('open')) {
            popupEvent.closeAllPopups(e);
            popupEvent.addPopup(dialog);
            this.#loadHistory();
            dialog.show();
            const dialogSizes = dialog.getBoundingClientRect();
            const btnSizes = btn.getBoundingClientRect();

            dialog.setAttribute(
                'style',
                `top: ${btnSizes.top + 35}px; left: ${Math.max(
                    btnSizes.left - dialogSizes.width,
                    20,
                )}px;
                 height: ${window.innerHeight - (btnSizes.top + 40)}px;
                 width: ${window.innerWidth > 360 ? 330 : 300}`,
            );
        } else {
            popupEvent.deletePopup(dialog);
            dialog.close();
        }
    };

    #loadHistory = async () => {
        const boardId = parseInt(this.parent.querySelector('.board-name__input').dataset.board, 10);
        await dispatcher.dispatch(actionGetHistory({ board_id: boardId }));

        const boardHistory = this.parent.querySelector('.board-history__list');
        const historyItems = workspaceStorage.getBoardHistory();

        boardHistory.innerHTML = '';
        historyItems.forEach((item) => {
            boardHistory.insertAdjacentHTML(
                'afterbegin',
                new HistoryItem(null, {
                    avatar_url: item.user.avatar_url,
                    email: item.user.email,
                    message: item.actions,
                    creationDate: item.timestamp,
                }).render(),
            );
        });
    };

    #resize = () => {
        window.requestAnimationFrame(() => {
            const dialog = this.parent.querySelector('#board-history');
            const btn = this.parent.querySelector('.btn-board-history');

            const dialogSizes = dialog.getBoundingClientRect();
            const btnSizes = btn.getBoundingClientRect();

            dialog.setAttribute(
                'style',
                `top: ${btnSizes.top + 35}px; left: ${Math.max(
                    btnSizes.left - dialogSizes.width,
                    20,
                )}px;
                 height: ${window.innerHeight - (btnSizes.top + 40)}px;
                 width: ${window.innerWidth > 360 ? 330 : 300}`,
            );
        });
    };
}
