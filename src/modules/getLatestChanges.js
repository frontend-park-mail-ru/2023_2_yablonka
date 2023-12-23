import workspaceStorage from "../storages/workspaceStorage";
import dispatcher from "./dispatcher";
import { actionGetHistory } from "../actions/boardActions";

getLatestChanges = async (id) => {
const edgeChangeIndex = workspaceStorage.getBoardHistory().length;

await dispatcher.dispatch(actionGetHistory({board_id:parseInt(id)}));

const currentHistory = workspaceStorage.getBoardHistory();

const latest = currentHistory.slice(edgeChangeIndex, currentHistory.length);

return latest;

}