// base view
import BaseView from './baseView.js';
// components
import SigninPage from '../pages/Signin/signin.js';
// storages
import userStorage from '../storages/userStorage.js';
// actions
import { actionNavigate, actionRedirect } from '../actions/userActions.js';
// routing
import emitter from '../modules/actionTrigger.js';
import dispatcher from '../modules/dispatcher.js';
import NotificationMessage from '../components/Common/notification/notificationMessage.js';
/**
 * Класс для рендера страницы логина
 * @class
 */
class Signin extends BaseView {
    constructor() {
        super();
        emitter.bind('signin', this.listenSigninAction);
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        document.title = 'Tabula: Sign In';
        this.components.push(new SigninPage(this.root, {}));

        this.render();
        this.addListeners();
    }

    /**
     * Функция, реагирующая на событие renderSignup, которое прокидывается через eventEmitter
     */
    listenSigninAction = () => {
        const status = userStorage.storage.get(userStorage.userModel.status);
        switch (status) {
            case 200:
                dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
                dispatcher.dispatch(actionRedirect('/main', false));
                break;
            case 401:
                NotificationMessage.showNotification(
                    this.root.querySelector('input[data-name="email"]').parentNode,
                    false,
                    true,
                    { fontSize: 14, fontWeight: 200, text: 'Неверный логин или пароль' },
                );
                break;
            default:
                break;
        }
    };

    /**
     * Ререндер страницы
     */
    async reRender() {
        this.clear();
        this.renderPage();
    }
}

const signin = new Signin();

export default signin;
