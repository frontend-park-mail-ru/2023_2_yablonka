import Component from '../../core/basicComponent.js';
import template from './errorMessage.hbs';
import './errorMessage.scss';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class ErrorMessage extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({ id: this.config.id });
    }

    static ShowErrorMessage = (delay) => {
        const id = Date.now();
        const err = new ErrorMessage(null, { id }).render();
        const errors = document.querySelectorAll('.error-message');

        if (!errors.length) {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex-column-centered gap-10 error-message-container';
            document.querySelector('.page__layout').appendChild(wrapper);
        }
        const container = document.querySelector('.error-message-container');
        container.insertAdjacentHTML('beforeend', err);

        setTimeout(() => {
            document.getElementById(`${id}`).remove();
        }, delay);
    };
}
