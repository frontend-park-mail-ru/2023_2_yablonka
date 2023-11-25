import QuestionnairePage from '../pages/Questionnaire/questionnaire';
import BaseView from './baseView';

/**
 * Класс для рендера iframe опросов
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
class Questionnaire extends BaseView {
    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        this.components.push(new QuestionnairePage(this.root, {questions}));

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
