import { actionLogout, actionNavigate, actionRedirect } from '../../actions/userActions.js';
import Questionnaire from '../../components/Questionnaire/questionnaire.js';
import Component from '../../components/core/basicComponent.js';
import dispatcher from '../../modules/dispatcher.js';
import template from './questionnaire.hbs';
import './questionnaire.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class QuestionnairePage extends Component {
    constructor() {
        super();
        this.questionNumber = 0;
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        const page = {
            questionnaire: new Questionnaire(null, this.config.questions[0]),
        };
        this.parent.insertAdjacentHTML('beforeend', template(page));
    }

    /**
     * Добавляет обработчики событий
     */
    addEventListeners() {
        this.parent
            .querySelector('.btn-questionnaire-navigation_next')
            .addEventListener('click', this.#nextQuestion);
        this.parent
            .querySelector('.btn-questionnaire-navigation_skip')
            .addEventListener('click', this.#skipQuestion);
        this.parent
            .querySelectorAll('.btn-rating')
            .forEach((el) => el.addEventListener('click', this.#activateRating));
    }

    /**
     * Убирает обработчики событий
     */
    removeEventListeners() {
        this.parent
            .querySelector('.btn-questionnaire-navigation_next')
            .addEventListener('click', this.#nextQuestion);
        this.parent
            .querySelector('.btn-questionnaire-navigation_skip')
            .addEventListener('click', this.#skipQuestion);
        this.parent
            .querySelectorAll('.btn-rating')
            .forEach((el) => el.removeEventListener('click', this.#activateRating));
    }

    #activateRating = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.parent.querySelectorAll('.btn-rating').array.forEach((el) => {
            if (el.dataset.metric === 'NSP') {
                el.style.fill = 'currentFill';
            } else {
                el.setAttribute(
                    'style',
                    'backgroung-color: var(--questionnaire-rating-background-color)',
                );
            }
            el.dataset.isActive = false;
        });

        this.parent.querySelectorAll('.btn-rating').array.forEach((el, ind) => {
            if (ind < e.target.closest('.btn-rating').dataset.rating) {
                if (el.dataset.metric === 'NSP') {
                    el.style.fill = 'rgb(232, 178, 42)';
                } else {
                    el.setAttribute('style', 'backgroung-color: var(--questionnaire-active)');
                }
                el.dataset.isActive = true;
            } else {
                el.dataset.isActive = false;
            }
        });
    };

    #nextQuestion = () => {
        this.questionNumber += 1;
        if (this.questionNumber < this.config.questions.lenght) {
            const newQuestionnaire = new Questionnaire(
                null,
                this.config.questions[this.questionNumber],
            ).render();

            const questionnaire = this.parent.querySelector('.questionnaire__content');
            questionnaire.innerHTML = newQuestionnaire;
        } else {
            this.#lastPage();
        }
    };

    #skipQuestion = () => {
        this.questionNumber += 1;
        if (this.questionNumber < this.config.questions.lenght) {
            const newQuestionnaire = new Questionnaire(
                null,
                this.config[this.questionNumber],
            ).render();

            const questionnaire = this.parent.querySelector('.questionnaire__content');
            questionnaire.innerHTML = newQuestionnaire;
        } else {
            this.#lastPage();
        }
    };

    #lastPage = () => {
        this.parent.querySelector('.questionnaire__title').textContent = 'Спасибо за ответы :)';

        this.parent.querySelector('.questionnaire__rating').style.display = 'none';
        this.parent.querySelector('.questionnaire__navigation').style.display = 'none';
    };

    #calculateRating = () => {
        let rating = 0;
        this.parent.querySelectorAll('.btn-rating').array.forEach((el) => {
            if (el.dataset.isActive) {
                rating += 1;
            }
        });
        return rating;
    };

    /**
     * Handler события нажатия на ссылку для перехода на log out
     * @param {Event} e - Событие
     */
    logoutHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionLogout());
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу досок
     * @param {Event} e - Событие
     */
    toBoardsHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/main', false));
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу смены пароля
     * @param {Event} e - Событие
     */
    toSecurityHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/security', false));
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу профиля
     * @param {Event} e - Событие
     */
    toProfileHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(actionRedirect('/profile', false));
    }

    /**
     * Handler события нажатия на ссылку для перехода на страницу доски
     * @param {Event} e - Событие
     */
    toBoardHandler(e) {
        e.preventDefault();
        dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
        dispatcher.dispatch(
            actionRedirect(e.target.closest('.link-user-board').getAttribute('href'), false),
        );
    }

    clear() {}
}
