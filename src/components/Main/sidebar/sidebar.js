import Component from '../../core/basicComponent.js';
import WorkspaceParagraph from '../atomic/workspaceParagraph/workspaceParagraph.js';
import template from './sidebar.hbs';
import './sidebar.scss';
/**
 * Меню слева
 * @class
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

    /**
     * Функция для получения отрендеренного массива c компонентами формы
     * @param {array} workspaces - данные input для рендера компонента формы
     * @return {array} inputs - массив с отрендеренными компонентами формы
     */
    #getWorkspaceParagraphs(workspaces) {
        const workspaceParagraphs = [];
        workspaces.forEach((workspace) => {
            workspaceParagraphs.push(
                new WorkspaceParagraph(null, {
                    paragraph: Array.from(workspace.workspace_name)[0],
                    name: workspace.workspace_name,
                    workspaceId: workspace.workspace_id,
                }).render(),
            );
        });
        return workspaceParagraphs;
    }
}
