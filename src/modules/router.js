import userStorage from '../storages/userStorage.js';
import { routes, signedInRoutes } from '../configs/configs.js';
import { boardHrefRegExp, hrefRegExp, navigationPagesHrefRegExp } from './regExp.js';
import emitter from './actionTrigger.js';
import offline from '../view/offline.js';

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

        emitter.bind('rerender', this.reRenderPage.bind(this));

        routes.forEach((route) => {
            this.registerView(route);
        });

        signedInRoutes.forEach((route) => {
            this.registerView(route, true);
        });
    }

    /**
     * Функция, которая рендерит страницу оффлайна
     */
    goOffline() {
        this.currentPage.clear();
        offline.renderPage();
    }

    /**
     * Ререндер страницы
     */
    reRenderPage() {
        this.currentPage.reRender();
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
    registerActions({ path, action }) {
        this.actions.set(path, action);
    }

    /**
     * Метод для выделения корневого элемента из URL после origin
     * @param {string} href - ссылка
     * @returns {string} - корневой элемент в виде строки
     */
    matchView(href) {
        if (href.match(navigationPagesHrefRegExp)) {
            return href;
        }
        if (href.match(boardHrefRegExp)) {
            return '/board';
        }
        return '/signin';
    }

    /**
     * Метод для валидации и определения текущего URL
     * @returns {string} - текущий URL
     */
    getPath(href) {
        return decodeURIComponent(href.replace(hrefRegExp, ''));
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
                window.history.pushState(state, '', `${window.location.origin}${path}`);
            } else {
                window.history.pushState('', '', `${window.location.origin}${path}`);
            }
        } else if (state) {
            window.history.replaceState(state, '', `${window.location.origin}${path}`);
        } else {
            window.history.replaceState('', '', `${window.location.origin}${path}`);
        }
        this.prevURL = path;
    }

    /**
     * Обработчик события изменения активной записи истории
     */
    onPopStateEvent = () => {
        const redirection = this.redirect(window.location.pathname);
        this.open(
            {
                path: redirection === window.location.pathname ? redirection : this.prevURL,
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

        this.navigate({ path, state, pushState });
        this.currentPage.renderPage();
    }

    /**
     * Метод для валидации переданного URL и определения редиректа
     * @param {string} href - корневой элемент URL после origin
     * @returns {string} - URL для редиректа без GET-параметорв
     */
    redirect(href) {
        userStorage.authVerify();
        const isAuth = userStorage.storage.get(userStorage.userModel.status) === 200;
        if (href === '/' || href === '') {
            return isAuth ? '/main' : '/signin';
        }
        if (!isAuth) {
            if (href === '/signup') {
                return href;
            }
            this.redirectUrl = href;
            return '/signin';
        }
        if (href === '/signin' || href === '/signup') {
            return '/main';
        }
        if (this.redirectUrl) {
            const redirectedHref = this.redirectUrl;
            this.redirectUrl = undefined;
            return redirectedHref;
        }
        return href;
    }

    /**
     * Метод для валидации URL и определения страницы для отображения
     * после перезагрузки окна браузера
     */
    refresh(pushState) {
        const matchedView = this.matchView(window.location.pathname);
        const redirectedPath = this.redirect(window.location.pathname);
        if (this.views.get(matchedView) || this.signedInViews.get(matchedView)) {
            this.open(
                {
                    path: redirectedPath,
                    state: '',
                },
                pushState,
            );
        } else {
            this.open(
                {
                    path: '/404',
                    state: '',
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
        console.log(window.location.href);

        this.refresh(false);
    }
}

const router = new Router();

export default router;
