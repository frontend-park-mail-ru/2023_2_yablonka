import emitter from '../../../modules/actionTrigger.js';
import Component from '../../core/basicComponent.js';
import template from './iframe.hbs';
import './iframe.scss';

/**
 * Контейнер для досок
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class IFrame extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        this.parent.querySelector('.iframe').addEventListener('load', this.#resiseQuestionnaire);
    }

    removeEventListeners() {
        this.parent.querySelector('.iframe').removeEventListener('load', this.#resiseQuestionnaire);
    }

    #resiseQuestionnaire = () => {
        const iframe = document.querySelector('#questionner-iframe');
        const size = iframe.contentDocument.querySelector('.questionnaire').getBoundingClientRect();
        iframe.setAttribute('style', `width: 450px; height: ${size.height}px`);
    };
}
