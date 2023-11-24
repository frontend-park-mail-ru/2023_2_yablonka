import Header from '../components/Common/header/header.js';
import BoardMenu from '../components/Board/boardMenu/boardMenu.js';
import userStorage from '../storages/userStorage.js';
import workspaceStorage from '../storages/workspaceStorage.js';
import BoardPage from '../pages/Board/board.js';
import Navigation from '../components/popups/navigation/navigation.js';
import dispatcher from '../modules/dispatcher.js';
import { actionGetBoard } from '../actions/boardActions.js';

/**
 * Класс для рендера страницы доски
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
class Board {
    #root;

    workspaceID;

    boardID;

    cardID;

    /**
     * @constructor
     */
    constructor() {
        this.#root = document.querySelector('.page');
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        const [w, wsID, b, bID, c, cID] = window.location.pathname.split('/');

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
