import Component from '../../core/basicComponent.js';
import template from './createWorkspace.hbs';
import './createWorkspace.scss';
import userStorage from '../../../storages/userStorage.js';
import { actionCreateWorkspace } from '../../../actions/workspaceActions.js';
import dispatcher from '../../../modules/dispatcher.js';
import { actionNavigate, actionRedirect } from '../../../actions/userActions.js';
import NotificationMessage from '../../Common/notification/notificationMessage.js';
import Validator from '../../../modules/validator.js';
import popupEvent from '../../core/popeventProcessing.js';
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
            .querySelector('input[data-name=workspace-name]')
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
            .querySelector('input[data-name=workspace-name]')
            .removeEventListener('input', this.#blockCreateButton);
    }

    #blockCreateButton = (e) => {
        e.preventDefault();
        const input = this.parent.querySelector('input[data-name="workspace-name"');
        const btn = this.parent.querySelector('.btn-create-workspace-pop-up');

        if (e.target.value.length === 0) {
            btn.disabled = true;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--need-text-color');
        } else {
            btn.disabled = false;
            input.setAttribute('style', 'box-shadow: inset 0 0 0 2px var(--main-btn-border-color');
        }
    };

    #createWorkspaceOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#create-workspace');

        if (dialog.getAttribute('open') !== null) {
            popupEvent.deletePopup(dialog);
            dialog.close();
        } else {
            popupEvent.addPopup(dialog);
            dialog.showModal();
            popupEvent.closeOtherPopups(dialog);
        }
    };

    #createWorkspaceClose = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = this.parent.querySelector('#create-workspace');

        if (e.target === e.currentTarget) {
            popupEvent.deletePopup(dialog);
            dialog.close();
        }
    };

    #createWorkspace = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const workspaceName = this.parent.querySelector('input[data-name=workspace-name]');
        const workspaceDescription = this.parent.querySelector(
            'textarea[data-name=workspace-description]',
        ).value;

        if (Validator.validateObjectName(workspaceName.value)) {
            this.#createWorkspaceOpen(e);

            dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
            dispatcher.dispatch(actionRedirect('/main', false));

            dispatcher.dispatch(
                actionCreateWorkspace({
                    description: workspaceDescription,
                    name: workspaceName.value,
                    owner_id: userStorage.storage.get(userStorage.userModel.body).body.user.user_id,
                }),
            );
        } else {
            NotificationMessage.showNotification(workspaceName, true, true, {
                fontSize: 12,
                fontWeight: 200,
                text: 'Некорректное название рабочего пространства',
            });
        }
    };
}
