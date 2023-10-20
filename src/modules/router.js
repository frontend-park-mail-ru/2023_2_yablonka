import userStorage from '../storages/userStorage.js';
import { ROOT, routes, signedinRoutes, actionsWithLogin } from '../configs/configs.js';
import SignIn from '../view/signin.js';

class Router {
    constructor(root) {
        this.root = root;
        this.views = new Map();
        this.signedinViews = new Map();
        this.actionsWithLogin = new Map();

        routes.forEach((route) => {
            this.registerView(route);
        });

        signedinRoutes.forEach((route) => {
            this.registerView(route, true);
        });

        actionsWithLogin.forEach((action) => {
            this.registerActions(action, true);
        });
    }

    registerView({ path, view }, privatePath = false) {
        privatePath ? this.signedinViews.set(path, view) : this.views.set(path, view);
    }

    registerActions({ path, action }, privateAction = false) {
        privateAction ? this.actionsWithLogin.set(path, action) : this.actions.set(path, action);
    }

    matchHref(href) {
        const parts = href.split('/');
        const newHref = [];
        parts.forEach((part) => {
            if (part !== '') {
                newHref.push(`/${part}`);
            }
        });

        return newHref;
    }

    onClickEvent = (e) => {
        e.preventDefault();
        const { target } = e;

        if (target instanceof HTMLElement || target instanceof SVGElement) {
            if (target.dataset.section) {
                const matchedHref = this.matchHref(target.dataset.section);

                if (
                    this.views.get(matchedHref[0]) ||
                    this.signedinViews.get(matchedHref[0]) ||
                    RegExp('^(\\/\\d+)').test(matchedHref[0])
                ) {
                    e.preventDefault();

                    this.navigate({ path: target.dataset.section, props: '', pushState: true });
                }
            }
        }
    };

    onPopStateEvent = () => {
        let matchedHref = [];
        matchedHref[0] = decodeURIComponent(
            window.location.href.match('/^w+:.*?(:)d|^w+://w+.w+/')
                ? window.location.href.replace('/^w+:.*?(:)d|^w+://w+.w+/', '')
                : window.location.href.replace('/^w+:.*?(:)d*/', ''),
        );

        matchedHref = this.matchHref(matchedHref[0]);

        this.open({ path: matchedHref[0], props: matchedHref[1] }, false, false);
        this.prevUrl = matchedHref[0];
    };

    open(stateObject, pushState, refresh) {
        if (this.currentPage) {
            this.currentPage.clear();
        }

        const { path } = stateObject;
        const { props } = stateObject;

        this.currentPage =
            this.views.get(stateObject.path) || this.signedinViews.get(stateObject.path);

        this.currentPage.renderPage();

        this.navigate({ path, props, pushState });
    }

    redirectHandle(href) {
        userStorage.authVerify();
        const isAuth = userStorage.storage.get(userStorage.userModel.status) === 200;
        if (href === '/') {
            return isAuth ? '/boards' : '/login';
        } else {
            if (!isAuth) {
                if (href === '/signup') {
                    return href;
                }
                this.redirectUrl = href;
                return '/login';
            } else {
                if (this.redirectUrl) {
                    href = this.redirectUrl;
                    this.redirectUrl = undefined;
                }
                return href;
            }
        }
    }

    refresh(redirect = false) {
        const href = this.redirectHandle(window.location.pathname);
        const matchedHref = this.matchHref(href);
        if (
            this.views.get(matchedHref[0]) ||
            this.signedinViews.get(matchedHref[0]) ||
            RegExp('^(\\/\\d+)').test(matchedHref[0])
        ) {
            this.open(
                {
                    path: matchedHref[0],
                    props: matchedHref[1],
                },
                !redirect,
                !redirect,
            );
        } else {
            SignIn.renderPage();
        }
    }

    start() {
        document.addEventListener('click', this.onClickEvent);
        window.addEventListener('popstate', this.onPopStateEvent);
        this.refresh();
    }

    navigate({ path, props, pushState }) {
        const location = decodeURIComponent(
            window.location.href.match('/^w+:.*?(:)d|^w+://w+.w+/')
                ? window.location.href.match('/^w+:.*?(:)d|^w+://w+.w+/')[0]
                : window.location.href.match(/.+:\/\/.+:\d+/)[0],
        );

        if (pushState) {
            if (props) {
                window.history.pushState(props, '', `${location + path}${props}`);
            } else {
                window.history.pushState(props, '', location + path);
            }
        } else {
            if (props) {
                window.history.replaceState(props, '', `${location + path}${props}`);
            } else {
                window.history.replaceState(props, '', location + path);
            }
        }
        this.prevUrl = path;
    }
}

const router = new Router(ROOT);
export default router;
