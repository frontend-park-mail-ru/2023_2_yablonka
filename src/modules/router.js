export default class Router {
    #routes;

    #currentRoute;

    #currentDynamicParams;

    constructor(routes) {
        this.routes = routes;
        this.currentRoute = undefined;
        this.currentDynamicParams = undefined;
    }

    /**
     * Запускает Router.
     * Вызывается при изменении URL в адресной строке.
     */
    init = () => {
        window.addEventListener('popstate', (e) => {
            e.preventDefault();

            this.go(window.location.pathname);
        });
    };

    /**
     * Изменяет текущий маршрут.
     * @param {string} path - Новый путь.
     */
    route = (path) => {
        this.go(path);

        window.history.pushState(this.currentDynamicParams, '', path);
    };

    /**
     * Ищет маршрут, соответствующий текущему пути.
     * @param {string} path - Текущий путь.
     */
    match = (path) => {
        this.currentRoute = this.routes.find((route) => {
            const match = path.match(route.path);

            if (match) {
                this.currentDynamicParams = match.slice(1);

                return true;
            }

            return false;
        });
    };

    /**
     * Обновляет состояние Router в соответствии с новым маршрутом.
     * @param {string} path - Новый путь.
     */
    go = (path) => {
        this.match(path);

        if (!this.currentRoute) {
            // TODO: отрендерить 404
            return;
        }

        this.#currentRoute.renderPage();
    };
}
