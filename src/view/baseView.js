import popeventProcess from '../components/core/popeventProcessing';

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
    }

    addListeners() {
        this.root.addEventListener('click', popeventProcess);
        this.components.forEach((cmp) => cmp.addEventListeners());
    }

    removeListeners() {
        this.root.addEventListener('click', popeventProcess);
        this.components.forEach((cmp) => cmp.removeEventListeners());
    }

    clear() {
        this.removeListeners();
        this.root.innerHTML = '';
        this.components = [];
    }
}
