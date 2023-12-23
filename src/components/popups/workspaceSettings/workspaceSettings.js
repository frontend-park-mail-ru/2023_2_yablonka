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
        this.parent.querySelectorAll('.btn-change-workspace').forEach((btn) => {
            btn.addEventListener('click', this.#openSettings);
        });
        this.parent
            .querySelector('.btn-change-workspace-name')
            .addEventListener('click', this.#renameWorkspace);
        this.parent
            .querySelector('.btn-delete-workspace')
            .addEventListener('click', this.deleteWorkspaceHandler);
        this.parent.addEventListener('keydown', this.#changeNameHandler);
        window.addEventListener('resize', this.#resize);
    }

    removeEventListeners() {
        this.parent.querySelectorAll('.btn-change-workspace').forEach((btn) => {
            btn.removeEventListener('click', this.#openSettings);
        });
        this.parent
            .querySelector('.btn-change-workspace-name')
            .removeEventListener('click', this.#renameWorkspace);
        this.parent
            .querySelector('.btn-delete-workspace')
            .removeEventListener('click', this.deleteWorkspaceHandler);
        this.parent.removeEventListener('keydown', this.#changeNameHandler);
        window.removeEventListener('resize', this.#resize);
    }

    #renameWorkspace = () => {
        const dialog = this.parent.querySelector('#workspace-settings');

        if (dialog.dataset.workspace) {
            const workspaceName = document.querySelector(
                `span[data-workspace="${dialog.dataset.workspace}"]`,
            );
            workspaceName.focus();

            popupEvent.deletePopup(dialog);
            dialog.close();
        }
    };

    #openSettings = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#workspace-settings');

        const btnCoordinates = e.target.closest('button').getBoundingClientRect();
        const workspaceId = e.target.closest('button').dataset.workspace;

        if (dialog.getAttribute('open') === null) {
            popupEvent.closeAllPopups();
            popupEvent.addPopup(dialog);
            dialog.show();
            dialog.setAttribute(
                'style',
                `top: ${btnCoordinates.top + 30}px; left: ${btnCoordinates.left}px`,
            );
        } else {
            popupEvent.deletePopup(dialog);
            dialog.close();
            if (workspaceId !== dialog.dataset.workspace) {
                popupEvent.closeAllPopups();
                popupEvent.addPopup(dialog);
                dialog.show();
                dialog.setAttribute(
                    'style',
                    `top: ${btnCoordinates.top + 30}px; left: ${btnCoordinates.left}px`,
                );
            }
        }
        dialog.dataset.workspace = workspaceId;
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
                    `top: ${btnCoordinates.top + 30}px; left: ${btnCoordinates.left}px`,
                );
            }
        });
    };

    deleteWorkspaceHandler = () => {
        const dialog = this.parent.querySelector('#workspace-settings');
        if (dialog.dataset.workspace) {
            const workspaceId = dialog.dataset.workspace;
            popupEvent.deletePopup(dialog);
            dialog.close();

            dispatcher.dispatch(actionDeleteWorkspace(workspaceId));
        }
    };

    #changeNameHandler = (e) => {
        if (e.target.closest('.workspace__name')) {
            e.stopPropagation();
            if (e.key === 'Enter') {
                e.preventDefault();
                const { textContent } = e.target;
                const workspaceID = e.target.dataset.workspace;
                const workspaceDescription = workspaceStorage.storage
                    .get(workspaceStorage.workspaceModel.body)
                    .body.workspaces.yourWorkspaces.find((ws) => ws.workspace_id === workspaceID);

                e.target.blur();

                this.parent.querySelector(`span[data-paragraph="${workspaceID}"]`).textContent =
                    textContent;

                dispatcher.dispatch(
                    actionUpdateWorkspace({
                        id: parseInt(workspaceID, 10),
                        name: textContent,
                        description: workspaceDescription,
                    }),
                );
            }
        }
    };
}
