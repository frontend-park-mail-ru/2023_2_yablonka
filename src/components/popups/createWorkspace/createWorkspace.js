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
    constructor(parent, config) {
        super(parent, config);
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        document
            .querySelector('.btn-create-workspace-pop-up')
            .addEventListener('click', this.#createWorkspace);
        document
            .querySelector('.menu__btn-create')
            .addEventListener('click', this.#createWorkspaceOpen);
        document
            .querySelector('#create-workspace')
            .addEventListener('click', this.#createWorkspaceClose);
    }

    removeEventListeners() {
        document
            .querySelector('.btn-create-workspace-pop-up')
            .removeEventListener('click', this.#createWorkspace);
        document
            .querySelector('.menu__btn-create')
            .removeEventListener('click', this.#createWorkspaceOpen);
        document
            .querySelector('#create-workspace')
            .removeEventListener('click', this.#createWorkspaceClose);
    }

    #createWorkspaceOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = document.querySelector('#create-workspace');

        if (dialog.getAttribute('open') === '') {
            dialog.close();
        } else {
            dialog.showModal();
        }
    };

    #createWorkspaceClose = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = document.querySelector('#create-workspace');

        if (e.target === e.currentTarget) {
            dialog.close();
        }
    };

    #createWorkspace = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = document.querySelector('#create-workspace');

        if (dialog.getAttribute('open') === '') {
            dialog.close();
        } else {
            dialog.showModal();
        }

        const workspaceName = document.querySelector('input[data-name=workspace-name').value;
        const workspaceDescription = document.querySelector(
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
