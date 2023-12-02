import popupEvent from '../components/core/popeventProcessing';
import emitter from '../modules/actionTrigger';

export default class BaseView {
    components = [];

    root;

    /**
     * @constructor
     */
    constructor() {
        this.root = document.querySelector('.page');
    }

    render() {
        this.components.forEach((cmp) => cmp.render());
        this.root.removeAttribute('style');
    }

    addListeners() {
        this.root.addEventListener('click', popupEvent.closeAllPopups);
        this.components.forEach((cmp) => cmp.addEventListeners());
    }

    removeListeners() {
        this.root.removeEventListener('click', popupEvent.closeAllPopups);
        this.components.forEach((cmp) => cmp.removeEventListeners());
    }

    clear() {
        this.root.setAttribute('style', 'filter: blur(8px)');

        this.removeListeners();
        popupEvent.clearPopups();
        this.root.innerHTML = '';
        this.components = [];
    }
}
