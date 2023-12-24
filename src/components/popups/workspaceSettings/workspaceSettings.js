import { actionDeleteWorkspace, actionUpdateWorkspace } from '../../../actions/workspaceActions.js';
import dispatcher from '../../../modules/dispatcher.js';
import workspaceStorage from '../../../storages/workspaceStorage.js';
import Component from '../../core/basicComponent.js';
import popupEvent from '../../core/popeventProcessing.js';
import template from './workspaceSettings.hbs';
import './workspaceSettings.scss';
/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class WorkspaceSettings extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        this.parent.querySelector('.user-workspaces').addEventListener('click', this.#openSettings);
        this.parent
            .querySelector('.btn-delete-workspace')
            .addEventListener('click', this.deleteWorkspace);
        this.parent.addEventListener('focusout', this.#renameWorkspace);
        window.addEventListener('resize', this.#resize);
    }

    removeEventListeners() {
        this.parent
            .querySelector('.user-workspaces')
            .removeEventListener('click', this.#openSettings);
        this.parent
            .querySelector('.btn-delete-workspace')
            .removeEventListener('click', this.deleteWorkspace);
        this.parent.removeEventListener('focusout', this.#renameWorkspace);
        window.removeEventListener('resize', this.#resize);
    }

    static ChangeWorkspaceName = (workspaceName) => {
        const dialog = this.parent.querySelector('#workspace-settings');

        if (dialog.dataset.workspace) {
            const workspaceParagraph = document.querySelector(
                `.workspace-paragraph[data-workspace="${dialog.dataset.workspace}"]`,
            );
            workspaceParagraph.textContent = workspaceName;
            [workspaceParagraph.previousElementSibling.textContent] = workspaceName;

            const workspaceLogo = document.querySelector(
                `.workspace-logo[data-workspace="${dialog.dataset.workspace}"]`,
            );
            [workspaceLogo.previousElementSibling.textContent] = workspaceName;
        }
    };

    #openSettings = (e) => {
        if (e.target.closest('.btn-change-workspace')) {
            e.preventDefault();
            e.stopPropagation();

            const dialog = this.parent.querySelector('#workspace-settings');

            const btn = e.target.closest('.btn-change-workspace');

            const btnCoordinates = btn.getBoundingClientRect();
            const workspaceId = parseInt(btn.dataset.workspace, 10);

            if (!dialog.hasAttribute('open')) {
                popupEvent.closeAllPopups();
                popupEvent.addPopup(dialog);
                dialog.show();
                dialog.setAttribute(
                    'style',
                    `top: ${btnCoordinates.top + 50}px; left: ${btnCoordinates.left - 20}px`,
                );
            } else {
                popupEvent.deletePopup(dialog);
                dialog.close();
                if (workspaceId !== parseInt(dialog.dataset.workspace, 10)) {
                    popupEvent.closeAllPopups();
                    popupEvent.addPopup(dialog);
                    dialog.show();
                    dialog.setAttribute(
                        'style',
                        `top: ${btnCoordinates.top + 50}px; left: ${btnCoordinates.left - 20}px`,
                    );
                }
            }
            dialog.dataset.workspace = workspaceId;
        }
    };

    #resize = () => {
        window.requestAnimationFrame(() => {
            const dialog = document.querySelector('#workspace-settings');

            if (dialog.dataset.workspace) {
                const btnCoordinates = document
                    .querySelector(
                        `.btn-change-workspace[data-workspace="${dialog.dataset.workspace}"]`,
                    )
                    .getBoundingClientRect();
                dialog.setAttribute(
                    'style',
                    `top: ${btnCoordinates.top + 50}px; left: ${btnCoordinates.left - 20}px`,
                );
            }
        });
    };

    deleteWorkspace = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const dialog = this.parent.querySelector('#workspace-settings');
        if (dialog.dataset.workspace) {
            popupEvent.deletePopup(dialog);
            dialog.close();

            await dispatcher.dispatch(
                actionDeleteWorkspace({ workspace_id: parseInt(dialog.dataset.workspace, 10) }),
            );
        }
    };

    #proccessKeydownWithRename = (e) => {
        if (e.target.closest('.workspace__name')) {
            e.stopPropagation();
            if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
            }
        }
    };

    #renameWorkspace = async (e) => {
        if (e.target.closest('.workspace__name')) {
            e.stopPropagation();
            e.preventDefault();
            const name = e.target.closest('.workspace__name').textContent;
            const workspaceID = parseInt(
                e.target.closest('.workspace__name').dataset.workspace,
                10,
            );

            const workspace = workspaceStorage.getWorkspaceById(workspaceID);
            if (workspace.name === '' || workspace.name === name) {
                e.target.closest.querySelector('.workspace__name').textContent = workspace.name;
            } else {
                await dispatcher.dispatch(
                    actionUpdateWorkspace({
                        id: parseInt(workspaceID, 10),
                        name,
                        description: workspace.description,
                    }),
                );
            }
        }
    };
}
