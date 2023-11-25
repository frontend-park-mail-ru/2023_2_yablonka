import QuestionnairePage from '../pages/Questionnaire/questionnaire';
import BaseView from './baseView';
import { actionGetQuestions } from '../actions/userActions';
import dispatcher from '../modules/dispatcher';

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
        this.components.push(new QuestionnairePage(this.root, { questions }));

        await dispatcher.dispatch(actionGetQuestions());

        this.render();
        this.addListeners();
    }

    async reRender() {
        this.clear();
        this.renderPage();
    }
}

const questionnaire = new Questionnaire();

export default questionnaire;
