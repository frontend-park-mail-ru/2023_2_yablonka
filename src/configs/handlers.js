import userStorage from '../storages/userStorage.js';
import router from '../modules/router.js';
import workspaceStorage from '../storages/workspaceStorage.js';

const handlers = [
    { type: 'authVerify', method: userStorage.authVerify.bind(userStorage) },
    { type: 'userSignup', method: userStorage.signup.bind(userStorage) },
    { type: 'userSignin', method: userStorage.signin.bind(userStorage) },
    { type: 'redirect', method: router.open.bind(router) },
    { type: 'navigate', method: router.navigate.bind(router) },
    { type: 'start', method: router.start.bind(router) },
    { type: 'userLogout', method: userStorage.logout.bind(userStorage) },
    { type: 'goSignup', method: userStorage.getSignupPage.bind(userStorage) },
    { type: 'goSignin', method: userStorage.getSigninPage.bind(userStorage) },
    { type: 'getWorkspaces', method: workspaceStorage.getWorkspaces.bind(workspaceStorage) },
    { type: 'updateProfile', method: userStorage.updateProfile.bind(userStorage) },
    { type: 'updatePassword', method: userStorage.updatePassword.bind(userStorage) },
    { type: 'updateAvatar', method: userStorage.updateAvatar.bind(userStorage) },
    { type: 'createWorkspace', method: workspaceStorage.createWorkspace.bind(workspaceStorage) },
    { type: 'deleteWorkspace', method: workspaceStorage.deleteWorkspace.bind(workspaceStorage) },
    { type: 'updateWorkspace', method: workspaceStorage.updateWorkspace.bind(workspaceStorage) },
    { type: 'createBoard', method: workspaceStorage.createBoard.bind(workspaceStorage) },
    { type: 'getBoard', method: workspaceStorage.getBoard.bind(workspaceStorage) },
    { type: 'createList', method: workspaceStorage.createList.bind(workspaceStorage) },
    { type: 'updateList', method: workspaceStorage.updateList.bind(workspaceStorage) },
    { type: 'deleteList', method: workspaceStorage.deleteList.bind(workspaceStorage) },
    { type: 'createCard', method: workspaceStorage.createCard.bind(workspaceStorage) },
    { type: 'updateCard', method: workspaceStorage.updateCard.bind(workspaceStorage) },
    { type: 'deleteCard', method: workspaceStorage.deleteCard.bind(workspaceStorage) },
];

export default handlers;
