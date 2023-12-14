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

    /**
     * функция рендера всех компонентов
     */
    render() {
        this.components.forEach((cmp) => cmp.render());
    }

    /**
     * функция добавлениея обработчиков событий каждого из компонентов
     */
    addListeners() {
        this.root.addEventListener('click', popupEvent.closeAllPopups);
        this.components.forEach((cmp) => cmp.addEventListeners());
        this.root.removeAttribute('style');
    }

    /**
     * функция удаления обработчиков событий каждого из компонентов
     */
    removeListeners() {
        this.root.removeEventListener('click', popupEvent.closeAllPopups);
        this.components.forEach((cmp) => cmp.removeEventListeners());
    }

    /**
     * функция очистки страницы перед рендером
     */
    clear() {
        this.root.setAttribute('style', 'filter: blur(10px)');
        this.removeListeners();
        popupEvent.clearPopups();
        this.root.innerHTML = '';
        this.components = [];
    }
}
