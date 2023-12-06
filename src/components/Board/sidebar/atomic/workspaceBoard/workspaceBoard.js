import Component from '../../../../core/basicComponent';
import template from './workspaceBoard.hbs';
import './workspaceBoard.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class WorkspaceBoard extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            thumbnail_url: this.config.thumbnail_url,
            name: this.config.name,
            workspaceID: this.config.workspace_id,
            boardID: this.config.id,
        });
    }
}
