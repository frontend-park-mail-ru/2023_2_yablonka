import Component from '../../core/basicComponent.js';
import template from './errorMessage.hbs';
import './errorMessage.scss';

/**
 * Ошибка при неправильном логине/пароле и тп
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class ErrorMessage extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforebegin', template(this.config));
    }
}
