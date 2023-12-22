import workspaceStorage from '../storages/workspaceStorage.js';
import { actionSubmitHistoryAction } from '../actions/boardActions.js';
import dispatcher from './dispatcher.js';

/**
 * Отправка лога изменения
 * @param {Number} id - id доски
 * @param {String} message - текст сообщения
 */
const sendChange = async (id, message) => {
    dispatcher.dispatch(
        actionSubmitHistoryAction({ actions: message, board_id: parseInt(id, 10) }),
    );
};

export default sendChange;
