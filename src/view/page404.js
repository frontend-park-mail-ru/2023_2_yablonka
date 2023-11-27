// components
import Error404 from '../pages/404/error404.js';
// storages
import userStorage from '../storages/userStorage.js';
// dispatcher
import BaseView from './baseView.js';

class Page404 extends BaseView {
    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        document.title = 'Tabula: Not found';

        const redirectionPage = userStorage.storage.get(userStorage.userModel.status) === 200 ?
            'На главную' :
            'Авторизоваться';

        this.components.push(new Error404(this.root, { redirectionPage }));

        this.render();
        this.addListeners();
    }

    async reRender() {
        this.clear();
        this.renderPage();
    }
}

const page404 = new Page404();

export default page404;
