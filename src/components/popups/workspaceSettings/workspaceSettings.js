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
            .querySelector('.user-workspaces')
            .addEventListener('keydown', this.#proccessKeydownWithRename);
        this.parent
            .querySelector('.btn-change-workspace-name')
            .addEventListener('click', this.#renameWorkspaceHandler);
        this.parent
            .querySelector('.btn-delete-workspace')
            .addEventListener('click', this.#deleteWorkspace);
        this.parent.addEventListener('focusout', this.#renameWorkspace);
        window.addEventListener('resize', this.#resize);
    }

    removeEventListeners() {
        this.parent
            .querySelector('.user-workspaces')
            .removeEventListener('click', this.#openSettings);
        this.parent
            .querySelector('.user-workspaces')
            .removeEventListener('keydown', this.#proccessKeydownWithRename);
        this.parent
            .querySelector('.btn-change-workspace-name')
            .removeEventListener('click', this.#renameWorkspaceHandler);
        this.parent
            .querySelector('.btn-delete-workspace')
            .removeEventListener('click', this.#deleteWorkspace);
        this.parent.removeEventListener('focusout', this.#renameWorkspace);
        window.removeEventListener('resize', this.#resize);
    }

    static changeWorkspaceName = (workspace) => {
        const workspaceParagraph = document.querySelector(
            `.workspace-paragraph[data-paragraph="${workspace.id}"]`,
        );
        workspaceParagraph.textContent = workspace.name;
        [workspaceParagraph.previousElementSibling.textContent] = workspace.name;

        const workspaceLogo = document.querySelector(
            `.workspace__name[data-workspace="${workspace.id}"]`,
        );
        [workspaceLogo.previousElementSibling.textContent] = workspace.name;
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

    #deleteWorkspace = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const dialog = this.parent.querySelector('#workspace-settings');
        if (dialog.dataset.workspace !== '') {
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
                e.target.closest('.workspace__name').blur();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                const workspaceName = e.target.closest('.workspace__name');
                const workspace = workspaceStorage.getWorkspaceById(
                    parseInt(workspaceName.dataset.workspace, 10),
                );
                workspaceName.textContent = workspace.workspace_name;
                workspaceName.blur();
            }
        }
    };

    #renameWorkspaceHandler = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const dialog = this.parent.querySelector('#workspace-settings');

        this.parent
            .querySelector(`.workspace__name[data-workspace="${dialog.dataset.workspace}"]`)
            .focus();

        popupEvent.deletePopup(dialog);
        dialog.close();
    };

    #renameWorkspace = async (e) => {
        if (e.target.closest('.workspace__name')) {
            e.stopPropagation();
            e.preventDefault();
            const name = e.target.closest('.workspace__name').textContent.trim();
            const workspaceID = parseInt(
                e.target.closest('.workspace__name').dataset.workspace,
                10,
            );
            const workspace = workspaceStorage.getWorkspaceById(workspaceID);
            if (name === '' || workspace.workspace_name === name) {
                e.target.closest('.workspace__name').textContent = workspace.workspace_name;
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
