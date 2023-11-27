import Component from '../../core/basicComponent.js';
import template from './sidebar.hbs';
import './sidebar.scss';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Sidebar extends Component {
    #innerConfig = {
        settings: [
            { name: 'Участники', icon: 'person.svg', action: 'manage-card-users' },
            { name: 'Даты', icon: 'clock.svg', action: 'manage-card-data' },
            { name: 'Чеклист', icon: 'checklist.svg', action: 'manage-card-checklist' },
            { name: 'Вложения', icon: 'paperclip.svg', action: 'manage-card-files' },
        ],
        actions: [{ name: 'Удалить', icon: 'trash.svg', action: 'delete-card' }],
    };

    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            settings: this.#innerConfig.settings,
            actions: this.#innerConfig.actions,
        });
    }
}
