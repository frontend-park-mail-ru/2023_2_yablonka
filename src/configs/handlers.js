import userStorage from '../storages/userStorage.js';
import router from '../modules/router.js';
import workspaceStorage from '../storages/workspaceStorage.js';

const handlers = [
    { type: 'authVerify', method: userStorage.authVerify.bind(userStorage) },
    { type: 'userSignup', method: userStorage.signup.bind(userStorage) },
    { type: 'userSignin', method: userStorage.signin.bind(userStorage) },
    { type: 'redirect', method: router.open.bind(router) },
    { type: 'start', method: router.start.bind(router) },
    { type: 'userLogout', method: userStorage.logout.bind(userStorage) },
    { type: 'goSignup', method: userStorage.getSignupPage.bind(userStorage) },
    { type: 'goSignin', method: userStorage.getSigninPage.bind(userStorage) },
    { type: 'boards', method: workspaceStorage.getWorkspaces.bind(workspaceStorage) },
];

export default handlers;
