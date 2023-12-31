import signInPage from '../view/signin.js';
import signUpPage from '../view/signup.js';
import Main from '../view/main.js';
import Board from '../view/board.js';
import Profile from '../view/profile.js';
import page404 from '../view/page404.js';
import Questionnaire from '../view/questionnaire.js';
// import Board from '../view/board.js';

export const apiPath = 'http://localhost:8080';

export const apiVersion = '/api/v2/';

export const routes = [
    { path: '/signin', view: signInPage },
    { path: '/signup', view: signUpPage },
    { path: '/404', view: page404 },
];

export const signedInRoutes = [
    { path: '/board', view: Board },
    { path: '/main', view: Main },
    { path: '/profile', view: Profile },
    { path: '/security', view: Profile },
    { path: '/questionnaire', view: Questionnaire },
];
