import signInPage from '../view/signin.js';
import signUpPage from '../view/signup.js';
import Boards from '../view/boards.js';
import Profile from '../view/profile.js';

export const apiPath = 'http://213.219.215.40:8080';

export const apiVersion = '/api/v2/';

export const routes = [
    { path: '/signin', view: signInPage },
    { path: '/signup', view: signUpPage },
];

export const signedInRoutes = [
    { path: '/boards', view: Boards },
    { path: '/profile', view: Profile },
    { path: '/security', view: Profile },
];

export const actionsWithLogin = [
    // { path: '/boards', action: actionGetBoards },
];
