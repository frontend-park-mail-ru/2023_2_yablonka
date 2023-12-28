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
        return template({});
    }

    static ShowErrorMessage = (delay) => {
        const err = new ErrorMessage(null, {}).render();
        document.querySelector('.page__layout').insertAdjacentHTML('beforeend', err);

        setTimeout(() => {
            document.querySelector('.error-message').remove();
        }, delay);
    };
}
