import Component from '../../core/basicComponent.js';
import template from './createWorkspace.hbs';
import './createWorkspace.scss';
import userStorage from '../../../storages/userStorage.js';
import { actionCreateWorkspace } from '../../../actions/workspaceActions.js';
import dispatcher from '../../../modules/dispatcher.js';
/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class CreateWorkspace extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        this.parent
            .querySelector('.btn-create-workspace-pop-up')
            .addEventListener('click', this.#createWorkspace);
        this.parent
            .querySelector('.btn-create-first-workspace')
            ?.addEventListener('click', this.#createWorkspaceOpen);
        this.parent
            .querySelector('.btn-create-workspace')
            ?.addEventListener('click', this.#createWorkspaceOpen);
        this.parent
            .querySelector('.menu__btn-create')
            .addEventListener('click', this.#createWorkspaceOpen);
        this.parent
            .querySelector('#create-workspace')
            .addEventListener('click', this.#createWorkspaceClose);
        this.parent
            .querySelector('input[data-name=workspace-name')
            .addEventListener('input', this.#blockCreateButton);
    }

    removeEventListeners() {
        this.parent
            .querySelector('.btn-create-workspace-pop-up')
            .removeEventListener('click', this.#createWorkspace);
        this.parent
            .querySelector('.btn-create-first-workspace')
            ?.removeEventListener('click', this.#createWorkspaceOpen);
        this.parent
            .querySelector('.btn-create-workspace')
            ?.removeEventListener('click', this.#createWorkspaceOpen);
        this.parent
            .querySelector('.menu__btn-create')
            .removeEventListener('click', this.#createWorkspaceOpen);
        this.parent
            .querySelector('#create-workspace')
            .removeEventListener('click', this.#createWorkspaceClose);
        this.parent
            .querySelector('input[data-name=workspace-name')
            .removeEventListener('input', this.#blockCreateButton);
    }

    #blockCreateButton = (e) => {
        e.preventDefault();
        const input = document.querySelector('input[data-name="workspace-name"');

        if (e.target.value.length === 0) {
            document.querySelector('.btn-create-workspace-pop-up').disabled = true;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--need-text-color');
        } else {
            document.querySelector('.btn-create-workspace-pop-up').disabled = false;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--main-btn-border-color');
        }
    };

    #createWorkspaceOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#create-workspace');

        if (dialog.getAttribute('open') === '') {
            dialog.close();
        } else {
            dialog.showModal();
        }
    };

    #createWorkspaceClose = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#create-workspace');

        if (e.target === e.currentTarget) {
            dialog.close();
        }
    };

    #createWorkspace = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#create-workspace');

        if (dialog.getAttribute('open') === '') {
            dialog.close();
        } else {
            dialog.showModal();
        }

        const workspaceName = this.parent.querySelector('input[data-name=workspace-name').value;
        const workspaceDescription = this.parent.querySelector(
            'textarea[data-name=workspace-description',
        ).value;

        dispatcher.dispatch(
            actionCreateWorkspace({
                description: workspaceDescription,
                name: workspaceName,
                owner_id: userStorage.storage.get(userStorage.userModel.body).body.user.user_id,
            }),
        );
    };
}
