import BaseView from "./baseView";

/**
 * Класс для рендера iframe опросов
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
class Questionnaire extends BaseView {
    constructor() {
        super();
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {

        this.render();
        this.addListeners();
    }

    async reRender() {
        this.clear();
        this.renderPage();
    }
}

const profile = new Questionnaire();

export default profile;
