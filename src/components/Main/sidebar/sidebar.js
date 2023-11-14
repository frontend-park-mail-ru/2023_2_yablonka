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
    constructor(parent, config) {
        super(parent, config);
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        const workspaceParagraphs = this.#getWorkspaceParagraphs(
            this.config.userWorkspaces ? this.config.userWorkspaces : [],
        );
        return template(workspaceParagraphs);
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
    }
}
