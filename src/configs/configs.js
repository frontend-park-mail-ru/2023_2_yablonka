import signInPage from '../view/signin.js';
import signUpPage from '../view/signup.js';
import Boards from '../view/boards.js';

export const apiPath = 'http://localhost:8080';

export const apiVersion = '/api/v2/';

export const routes = [
    { path: '/signin', view: signInPage },
    { path: '/signup', view: signUpPage },
];

export const signedInRoutes = [{ path: '/boards', view: Boards }];

export const actionsWithLogin = [
    // { path: '/boards', action: actionGetBoards },
];
