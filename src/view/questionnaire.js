import QuestionnairePage from '../pages/Questionnaire/questionnaire.js';
import BaseView from './baseView.js';
import { actionGetQuestions } from '../actions/userActions.js';
import dispatcher from '../modules/dispatcher.js';
import userStorage from '../storages/userStorage.js';

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
        // await dispatcher.dispatch(actionGetQuestions());
        this.components.push(
            new QuestionnairePage(this.root, {
                questions: userStorage.getStoredQuestions(),
                id: 'questionner-iframe',
            }),
        );

        this.render();
        this.addListeners();
    }
}

const questionnaire = new Questionnaire();

export default questionnaire;
