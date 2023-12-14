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
import NotificationMessage from '../components/Common/notification/notificationMessage.js';

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
    listenSignUpAction = () => {
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
            case 409:
                NotificationMessage.showNotification(
                    this.root.querySelector('input[data-name="email"]').parentNode,
                    false,
                    true,
                    { fontSize: 14, fontWeight: 200, text: 'Такой email уже существует' },
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

const signUp = new Signup();

export default signUp;
