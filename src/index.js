import '../static/scss/style.scss';

import Dispatcher from './modules/dispatcher.js';
import { actionStart } from './actions/userActions.js';

Dispatcher.dispatch(actionStart());


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then((reg) => {
            console.log('sw registered', reg);
        })
        .catch((e) => {
            console.error(e);
        });
}