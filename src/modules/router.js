import userStorage from '../storages/userStorage.js';
import { routes, signedInRoutes, actionsWithLogin } from '../configs/configs.js';

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
            window.location.href.match('/^w+:.*?(:)d|^w+://w+.w+/')
                ? window.location.href.replace('/^w+:.*?(:)d|^w+://w+.w+/', '')
                : window.location.href.replace('/^w+:.*?(:)d*/', ''),
        );
    }

    /**
     * Обработчик события нажатия на ссылку через HTML- и SVG-элементы
     * @param {Event} e - объект интерфейса Event
     */
    onClickEvent = (e) => {
        e.preventDefault();
        const { target } = e;

        if (target instanceof HTMLElement || target instanceof SVGElement) {
            if (target.dataset.section) {
                const matchedView = this.matchView(target.dataset.section);
                if (this.views.get(matchedView) || this.signedInViews.get(matchedView)) {
                    this.navigate({ path: target.dataset.section, props: '', pushState: true });
                }
            }
        }
    };

    /**
     * Метод для изменения истории текущей сессии браузера
     * @param {string} stateObject.path - URL без GET-параметров
     * @param {props} stateObject.props - GET-параметры запроса
     * @param {boolean} stateObject.pushState - требуется ли запись в историю браузера
     */
    navigate({ path, props, pushState }) {
        if (pushState) {
            if (props) {
                window.history.pushState(props, '', `${path}?${props}`);
            } else {
                window.history.pushState(props, '', `${path}`);
            }
        } else if (props) {
            window.history.replaceState(props, '', `${path}?${props}`);
        } else {
            window.history.replaceState(props, '', `${path}`);
        }
    }

    /**
     * Обработчик события изменения активной записи истории
     */
    onPopStateEvent = () => {
        const [_path, _props] = this.getPath().split('?');
        this.open({ path: _path, props: _props ?? '' }, false);
    };

    /**
     * Метод для запуска процесса отображения страницы по переданному URL
     * @param {string} stateObject.path - URL без GET-параметров
     * @param {props} stateObject.props - GET-параметры запроса
     * @param {boolean} stateObject.pushState - требуется ли запись в историю браузера
     */
    open(stateObject, pushState) {
        if (this.currentPage) {
            this.currentPage.clear();
        }

        const { path, props } = stateObject;
        const currentView = this.matchView(path);

        this.currentPage = this.views.get(currentView) || this.signedInViews.get(currentView);

        this.currentPage.renderPage();
        this.navigate({ path, props, pushState });
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
    refresh() {
        const matchedPath = this.getPath();
        const matchedView = this.matchView(matchedPath);
        const [_path, _props] = matchedPath.split('?');

        const redirectedPath = this.redirect(_path.replace(window.location.origin, ''));
        const redirectedProps = redirectedPath === _path ? _props : '';

        if (this.views.get(matchedView) || this.signedInViews.get(matchedView)) {
            this.open(
                {
                    path: redirectedPath,
                    props: redirectedProps,
                },
                true,
            );
        } else {
            this.open(
                {
                    path: `${window.location.origin}/signin`,
                    props: '',
                },
                true,
            );
        }
    }

    /**
     * Метод для запуска роутера
     */
    start() {
        document.addEventListener('click', this.onClickEvent);
        window.addEventListener('popstate', this.onPopStateEvent);
        this.refresh();
    }
}

const router = new Router();

export default router;
