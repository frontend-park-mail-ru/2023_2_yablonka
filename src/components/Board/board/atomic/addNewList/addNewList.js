import Component from '../../../../core/basicComponent';
import template from './addNewList.hbs';
import './addNewList.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class AddNewList extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({});
    }
}
