import Component from '../../core/basicComponent.js';
import WorkspaceParagraph from '../atomic/workspaceParagraph/workspaceParagraph.js';
import template from './sidebar.hbs';
import './sidebar.scss';
/**
 * Меню слева
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Sidebar extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        const workspaceParagraphs = this.#getWorkspaceParagraphs(
            this.config?.yourWorkspaces ? this.config.yourWorkspaces : [],
        );
        return template({ workspaceParagraphs });
    }

    #getWorkspaceParagraphs(workspaces) {
        const workspaceParagraphs = [];
        workspaces.forEach((workspace) => {
            workspaceParagraphs.push(
                new WorkspaceParagraph(null, {
                    paragraph: Array.from(workspace.workspace_name)[0],
                    name: workspace.workspace_name,
                }).render(),
            );
        });
        return workspaceParagraphs;
    }
}
