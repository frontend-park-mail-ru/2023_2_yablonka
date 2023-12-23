import Component from '../../core/basicComponent.js';
import template from './workspace.hbs';
import './workspace.scss';
/**
 * Компонент рабочего пространства
 * @class
 */
export default class Workspace extends Component {
    /**
     * Рендерит компонент
     */
    render() {
        return template({
            workspaceIcon: Array.from(this.config.workspaceName)[0],
            ...this.config,
        });
    }
}
