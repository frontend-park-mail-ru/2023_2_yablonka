import '../static/scss/style.scss';

import Dispatcher from './modules/dispatcher.js';
import { actionStart } from './actions/userActions.js';

Dispatcher.dispatch(actionStart());
