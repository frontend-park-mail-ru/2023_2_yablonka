import '../static/scss/style.scss';

import Dispatcher, { dispatcher } from './modules/dispatcher.js';
import { actionGoOffline, actionStart } from './actions/userActions.js';

Dispatcher.dispatch(actionStart());

if (!navigator.onLine) {
    dispatcher.dispatch(actionGoOffline());
}

window.onoffline = () => {
    dispatcher.dispatch(actionGoOffline());
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .catch();
}
