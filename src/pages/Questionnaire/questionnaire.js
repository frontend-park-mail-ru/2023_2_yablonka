import {
    actionAnswerQuestion,
    actionLogout,
    actionNavigate,
    actionRedirect,
} from '../../actions/userActions.js';
import QuestionnaireContent from '../../components/Questionnaire/questionnaireContent/questionnaireContent.js';
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
    constructor(parent, config) {
        super(parent, config);
        this.id = config.id;
    }

    questionNumber = 0;

    /**
     * Рендерит компонент в DOM
     */
    render() {
        const page = {
            content: new QuestionnaireContent(null, this.config.questions[0]).render(),
        };
        this.parent.insertAdjacentHTML('beforeend', template(page));
    }

    /**
     * Добавляет обработчики событий
     */
    addEventListeners() {
        this.parent
            .querySelector('.btn-questionnaire-navigation_next')
            .addEventListener('click', this.#nextQuestion.bind(this, this.#sendRating));
        this.parent.querySelector('.btn-close-iframe').addEventListener('click', this.#closeIframe);
        this.parent.querySelector('.btn-questionnaire-navigation_skip').addEventListener(
            'click',
            this.#nextQuestion.bind(this, () => {}),
        );
        this.addButtonEventListeners();
    }

    addButtonEventListeners() {
        this.parent.querySelectorAll('.btn-rating').forEach((el) => {
            el.addEventListener('click', this.#activateRating);
        });
    }

    removeButtonEventListeners() {
        this.parent.querySelectorAll('.btn-rating').forEach((el) => {
            el.removeEventListener('click', this.#activateRating);
        });
    }

    /**
     * Убирает обработчики событий
     */
    removeEventListeners() {
        this.parent
            .querySelector('.btn-questionnaire-navigation_next')
            .addEventListener('click', this.#nextQuestion());
        this.parent
            .querySelector('.btn-close-iframe')
            .removeEventListener('click', this.#closeIframe);
        this.parent
            .querySelector('.btn-questionnaire-navigation_skip')
            .addEventListener('click', this.#nextQuestion);
        this.removeButtonEventListeners();
    }

    #activateRating = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { metric, rating } = e.target.closest('.btn-rating').dataset;

        this.parent.querySelectorAll('.btn-rating').forEach((el) => {
            if (metric === 'NSP') {
                el.querySelector('.bi-star-fill').setAttribute('fill', 'currentColor');
            } else {
                el.setAttribute(
                    'style',
                    'background-color: var(--questionnaire-rating-background-color)',
                );
            }
            el.setAttribute('data-isActive', false);
        });
        this.parent.querySelectorAll('.btn-rating').forEach((el, ind) => {
            if (ind < rating) {
                if (metric === 'NSP') {
                    el.querySelector('.bi-star-fill').setAttribute('fill', 'rgb(232, 178, 42)');
                } else {
                    el.setAttribute('style', 'background-color: var(--questionnaire-active)');
                }
                el.setAttribute('data-isActive', true);
            } else {
                el.setAttribute('data-isActive', false);
            }
        });
    };

    #nextQuestion = (callback) => {
        this.questionNumber += 1;
        if (this.questionNumber < this.config.questions.length) {
            const newQuestionnaire = new QuestionnaireContent(
                null,
                this.config.questions[this.questionNumber],
            ).render();

            this.removeButtonEventListeners();
            callback();

            const questionnaire = this.parent.querySelector('.questionnaire__content');
            questionnaire.innerHTML = '';
            questionnaire.insertAdjacentHTML('beforeend', newQuestionnaire);
            this.addButtonEventListeners();
        } else {
            this.#lastPage();
        }
    };

    #lastPage = () => {
        this.parent.querySelector('.questionnaire__title').textContent = 'Спасибо за ответы :)';

        this.parent.querySelector('.questionnaire__rating').style.display = 'none';
        this.parent.querySelector('.questionnaire__navigation').style.display = 'none';

        this.#closeIframeTimeout();
    };

    #calculateRating = () => {
        let rating = 0;
        this.parent.querySelectorAll('.btn-rating').forEach((el) => {
            if (el.dataset.isActive) {
                rating += 1;
            }
        });
        return rating;
    };

    #sendRating = () => {
        dispatcher.dispatch(
            actionAnswerQuestion({
                question_id: this.config.questions[this.questionNumber - 1].id,
                rating: this.#calculateRating,
            }),
        );
    };

    #closeIframeTimeout = () => {
        setTimeout(() => {
            parent.document.querySelector(`#${this.id}`).setAttribute('style', 'display: none');
        }, 1000);
    };

    #closeIframe = (e) => {
        e.preventDefault();
        e.stopPropagation();
        parent.document.querySelector(`#${this.id}`).setAttribute('style', 'display: none');
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
}
