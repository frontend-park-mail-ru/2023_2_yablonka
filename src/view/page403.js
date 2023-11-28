// components
import Error403 from '../pages/403/error403.js';
// storages
import userStorage from '../storages/userStorage.js';
// dispatcher
import BaseView from './baseView.js';

import emitter from '../modules/actionTrigger.js';

class Page403 extends BaseView {

    constructor() {
        super();
        emitter.bind('noaccess', this.renderPage.bind(this));
    }
    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        document.title = 'Tabula: Not found';

        const redirectionPage = userStorage.storage.get(userStorage.userModel.status) === 200 ?
            'На главную' :
            'Авторизоваться';

        this.components.push(new Error403(this.root, { redirectionPage }));

        this.render();
        this.addListeners();
    }

    async reRender() {
        this.clear();
        this.renderPage();
    }
}

const page403 = new Page403();

export default page403;
