// base view
import BaseView from './baseView.js';
// components
import SignupPage from '../pages/Signup/signup.js';
// storages
import userStorage from '../storages/userStorage.js';
// actions
import { actionNavigate, actionRedirect } from '../actions/userActions.js';
// routing
import emitter from '../modules/actionTrigger.js';
import dispatcher from '../modules/dispatcher.js';

/**
 * Класс для рендера страницы регистрации
 * @class
 */
class Signup extends BaseView {
    constructor() {
        super();
        emitter.bind('signup', this.listenSignUpAction);
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        document.title = 'Tabula: Sign Up';
        this.components.push(new SignupPage(this.root, {}));

        this.render();
        this.addListeners();
    }

    /**
     * Функция реагирующая на событие renderSignup, которое прокидывается через eventEmitter
     */
    listenSignUpAction() {
        const status = userStorage.storage.get(userStorage.userModel.status);
        switch (status) {
            case 200:
                dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
                dispatcher.dispatch(actionRedirect('/main', false));
                break;
            case 401:
                break;
            case 409:
                break;
            default:
                break;
        }
    }
}

const signUp = new Signup();

export default signUp;
