import userStorage from '../storages/userStorage.js';
import { routes, signedInRoutes, actionsWithLogin } from '../configs/configs.js';
import { hrefRegExp } from './regExp.js';

/**
 * Класс, реализующий роутер
 * @class
 */
class Router {
    /**
     * @constructor
     */
    constructor() {
        this.views = new Map();
        this.signedInViews = new Map();
        this.actionsWithLogin = new Map();

        routes.forEach((route) => {
            this.registerView(route);
        });

        signedInRoutes.forEach((route) => {
            this.registerView(route, true);
        });

        actionsWithLogin.forEach((action) => {
            this.registerActions(action, true);
        });
    }

    /**
     * Метод для валидации и определения текущего URL
     * @param {string} route.path - path, по которому будет происходить вызов view
     * @param {string} route.view - view, которая вызывается через path
     */
    registerView({ path, view }, privatePath = false) {
        if (privatePath) {
            this.signedInViews.set(path, view);
        } else {
            this.views.set(path, view);
        }
    }

    /**
     * Метод для валидации и определения текущего URL
     * @param {string} route.path - path, по которому будет происходить вызов action
     * @param {string} route.action - action, которое вызывается через path
     */
    registerActions({ path, action }, privateAction = false) {
        if (privateAction) {
            this.actionsWithLogin.set(path, action);
        } else {
            this.actions.set(path, action);
        }
    }

    /**
     * Метод для выделения корневого элемента из URL после origin
     * @param {string} href - ссылка
     * @returns {string} - корневой элемент в виде строки
     */
    matchView(href) {
        const parts = href.split('/');
        if (parts[3]) {
            return `/${parts[3]}`;
        }
        return '/signin';
    }

    /**
     * Метод для валидации и определения текущего URL
     * @returns {string} - текущий URL
     */
    getPath() {
        return decodeURIComponent(
            window.location.href.match(hrefRegExp.host)
                ? window.location.href.replace(hrefRegExp.host, '')
                : window.location.href.replace(hrefRegExp.localhost, ''),
        );
    }

    /**
     * Метод для изменения истории текущей сессии браузера
     * @param {string} stateObject.path - URL без GET-параметров
     * @param {state} stateObject.state - GET-параметры запроса
     * @param {boolean} stateObject.pushState - требуется ли запись в историю браузера
     */
    navigate({ path, state, pushState }) {
        if (pushState) {
            if (state) {
                window.history.pushState(state, '', path);
            } else {
                window.history.pushState('', '', path);
            }
        } else if (state) {
            window.history.replaceState(state, '', path);
        } else {
            window.history.replaceState('', '', path);
        }
        this.prevURL = path;
    }

    /**
     * Обработчик события изменения активной записи истории
     */
    onPopStateEvent = () => {
        const redirection = this.redirect(window.location.href.replace(window.location.origin, ''));
        this.open(
            {
                path: redirection === window.location.href ? redirection : this.prevURL,
                state: '',
            },
            false,
        );
    };

    /**
     * Метод для запуска процесса отображения страницы по переданному URL
     * @param {string} stateObject.path - URL без GET-параметров
     * @param {state} stateObject.state - GET-параметры запроса
     * @param {boolean} stateObject.pushState - требуется ли запись в историю браузера
     */
    open(stateObject, pushState) {
        if (this.currentPage) {
            this.currentPage.clear();
        }

        const { path, state } = stateObject;
        const currentView = this.matchView(path);

        this.currentPage = this.views.get(currentView) || this.signedInViews.get(currentView);

        this.currentPage.renderPage();
        this.navigate({ path, state, pushState });
    }

    /**
     * Метод для валидации переданного URL и определения редиректа
     * @param {string} href - корневой элемент URL после origin
     * @returns {string} - URL для редиректа без GET-параметорв
     */
    redirect(href) {
        userStorage.authVerify();
        const isAuth = userStorage.storage.get(userStorage.userModel.status) === 200;

        if (href === '/') {
            return isAuth ? `${window.location.origin}/boards` : `${window.location.origin}/signin`;
        }

        if (!isAuth) {
            if (href === '/signup') {
                return `${window.location.origin}${href}`;
            }
            this.redirectUrl = href;
            return `${window.location.origin}/signin`;
        }
        if (href === '/signin' || href === '/signup') {
            return `${window.location.origin}/boards`;
        }
        if (this.redirectUrl) {
            const redirectedHref = this.redirectUrl;
            this.redirectUrl = undefined;
            return redirectedHref;
        }
        return `${window.location.origin}${href}`;
    }

    /**
     * Метод для валидации URL и определения страницы для отображения
     * после перезагрузки окна браузера
     */
    refresh(pushState) {
        const matchedPath = this.getPath();
        const matchedView = this.matchView(matchedPath);

        const redirectedPath = this.redirect(matchedPath.replace(window.location.origin, ''));
        const pageState = '';

        if (this.views.get(matchedView) || this.signedInViews.get(matchedView)) {
            this.open(
                {
                    path: redirectedPath,
                    state: pageState,
                },
                pushState,
            );
        } else {
            this.open(
                {
                    path: `${window.location.origin}/signin`,
                    state: pageState,
                },
                pushState,
            );
        }
    }

    /**
     * Метод для запуска роутера
     */
    start() {
        window.addEventListener('popstate', this.onPopStateEvent);
        this.refresh(false);
    }
}

const router = new Router();

export default router;
