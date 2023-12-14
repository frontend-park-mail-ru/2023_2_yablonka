// components
import Offline from '../pages/offline/offline.js';
// storages
import userStorage from '../storages/userStorage.js';
// dispatcher
import BaseView from './baseView.js';

import emitter from '../modules/actionTrigger.js';
/**
 * Страница оффлайна
 * @class
 */
class OfflinePage extends BaseView {

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        document.title = 'Tabula: No Connection';
        this.clear();

        this.components.push(new Offline(this.root, {}));

        this.render();
        this.addListeners();
    }
}

const offline = new OfflinePage();

export default offline;
