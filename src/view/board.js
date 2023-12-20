import userStorage from '../storages/userStorage.js';
import workspaceStorage from '../storages/workspaceStorage.js';
import BoardPage from '../pages/Board/board.js';
import Navigation from '../components/popups/navigation/navigation.js';
import dispatcher from '../modules/dispatcher.js';
import { actionGetBoard } from '../actions/boardActions.js';
import { actionGetWorkspaces } from '../actions/workspaceActions.js';
import BaseView from './baseView.js';
import CreateBoard from '../components/popups/createBoard/createBoard.js';
import BoardSettings from '../components/popups/boardSettings/boardSettings.js';
import CreateWorkspace from '../components/popups/createWorkspace/createWorkspace.js';
import ListSettings from '../components/popups/listSettings/listSettings.js';
import Card from '../components/Card/card.js';
import AddDate from '../components/Card/popups/addDate/addDate.js';
import AddBoardUsers from '../components/popups/addBoardUsers/addBoardUsers.js';
import AddCardUsers from '../components/Card/popups/addUsers/addUsers.js';
import AddChecklist from '../components/Card/popups/addChecklist/addChecklist.js';
import { actionNavigate, actionRedirect } from '../actions/userActions.js';
import AddFile from '../components/Card/popups/addFile/addFile.js';

/**
 * Класс для рендера страницы доски
 * @class
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

        for (const data of linkData) {
            boardData.push(data[0]);
        }

        const [wsID, bID, cID] = boardData;

        this.workspaceID = wsID;
        this.boardID = bID;
        this.cardID = cID;

        if (cID && !workspaceStorage.getCardById(parseInt(cID, 10))) {
            dispatcher.dispatch(actionNavigate(window.location.pathname, '', false));
            dispatcher.dispatch(actionRedirect('/404', false));
        }

        await dispatcher.dispatch(actionGetWorkspaces());
        await dispatcher.dispatch(actionGetBoard(parseInt(this.boardID, 10)));

        const { user } = userStorage.storage.get(userStorage.userModel.body).body;
        const board = workspaceStorage.getBoardById(parseInt(this.boardID, 10));

        this.components.push(new BoardPage(this.root, { user, board }));

        this.components.push(
            ...[
                new Navigation(this.root, user),
                new CreateWorkspace(this.root, {}),
                new CreateBoard(this.root, {}),
                new BoardSettings(this.root, {
                    is_owner: workspaceStorage.isOwner(user.user_id, parseInt(this.boardID, 10)),
                    board_id: this.boardID,
                }),
                new ListSettings(this.root, {}),
                new Card(this.root, { avatar: user.avatar_url }),
                new AddDate(this.root, {}),
                new AddCardUsers(this.root, {}),
                new AddBoardUsers(this.root, {}),
                new AddChecklist(this.root, {}),
                new AddFile(this.root, {}),
            ],
        );

        this.render();
        this.addListeners();

        if (cID && workspaceStorage.getCardById(parseInt(cID, 10))) {
            Card.openByRedirect(cID);
        }

        BoardSettings.resizeBoardNameInput();
    }

    /**
     * Ререндер страницы
     */
    reRender() {
        this.clear();
        this.renderPage();
    }
}

const board = new Board();

export default board;
