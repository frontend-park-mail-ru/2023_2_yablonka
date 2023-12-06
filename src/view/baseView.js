import popupEvent from '../components/core/popeventProcessing';

export default class BaseView {
    components = [];

    root;

    /**
     * @constructor
     */
    constructor() {
        this.root = document.querySelector('.page');
    }

    /**Рендер компонентов */
    render() {
        this.components.forEach((cmp) => cmp.render());
    }

    /**
     * Добавить листенеры
     */
    addListeners() {
        this.root.addEventListener('click', popupEvent.closeAllPopups);
        this.components.forEach((cmp) => cmp.addEventListeners());
        this.root.removeAttribute('style');
        
    }

    /**
     * Убрать листенеры
     */
    removeListeners() {
        this.root.removeEventListener('click', popupEvent.closeAllPopups);
        this.components.forEach((cmp) => cmp.removeEventListeners());
    }

    /**
     * Очистка страницы
     */
    clear() {
        this.root.setAttribute('style', 'filter: blur(10px)');
        this.removeListeners();
        popupEvent.clearPopups();
        this.root.innerHTML = '';
        this.components = [];
    }
}
