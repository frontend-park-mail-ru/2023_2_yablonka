import '../static/scss/style.scss';

import Dispatcher, { dispatcher } from './modules/dispatcher.js';
import { actionGoOffline, actionRedirect, actionStart } from './actions/userActions.js';

Dispatcher.dispatch(actionStart());

if(!navigator.onLine){
    console.log('Offline');
    dispatcher.dispatch(actionGoOffline());
}

window.onoffline=()=>{
dispatcher.dispatch(actionGoOffline());
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then((reg) => {
            console.log('sw registered', reg);
        })
        .catch((e) => {
            console.error(e);
        });
}