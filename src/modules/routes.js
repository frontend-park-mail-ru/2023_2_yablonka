import SignIn from '../pages/signIn.js';
import SignUp from '../pages/signUp.js';
import YourDesks from '../pages/yourDesks.js';
import Router from './router.js';

const routes = [
    {
        path: /^\/desks$/,
        page: new YourDesks(),
    },
    {
        path: /^\/signup$/,
        page: new SignUp(),
    },
    {
        path: /^\/signin$/,
        page: new SignIn(),
    },
];

const router = new Router(routes);

export default router;
