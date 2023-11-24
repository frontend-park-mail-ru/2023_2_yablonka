import userStorage from '../storages/userStorage.js';
import workspaceStorage from '../storages/workspaceStorage.js';
import BoardPage from '../pages/Board/board.js';
import Navigation from '../components/popups/navigation/navigation.js';
import dispatcher from '../modules/dispatcher.js';
import { actionGetBoard } from '../actions/boardActions.js';
import BaseView from './baseView.js';

/**
 * Класс для рендера страницы доски
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
class Board extends BaseView {
    workspaceID;

    boardID;

    cardID;

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        const boardData = [];
        const linkData = window.location.pathname.matchAll(/\d+/g);
        for (let data of linkData) {
            boardData.push(data[0]);
        }
        const [wsID, bID, cID] = boardData;

        this.workspaceID = wsID;
        this.boardID = bID;
        this.cardID = cID;

        await dispatcher.dispatch(actionGetBoard(parseInt(this.boardID, 10)));

        const { user } = userStorage.storage.get(userStorage.userModel.body).body;
        const board = workspaceStorage.getBoardById(parseInt(this.boardID, 10));

        this.components.push(new BoardPage(this.root, { user, board }));

        this.components.push(...[new Navigation(this.root, user)]);

        this.render();
        this.addListeners();
    }
}

const board = new Board();

export default board;
