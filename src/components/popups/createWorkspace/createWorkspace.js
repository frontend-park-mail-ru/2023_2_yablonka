import Component from '../../core/basicComponent.js';
import template from './createWorkspace.hbs';
import './createWorkspace.scss';
import userStorage from '../../../storages/userStorage.js';
import { actionCreateWorkspace } from '../../../actions/workspaceActions.js';
import dispatcher from '../../../modules/dispatcher.js';
import { actionNavigate } from '../../../actions/userActions.js';
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
            .querySelector('.container-main')
            ?.addEventListener('click', this.#openCreateWorkspace);
        this.parent
            .querySelector('.menu__btn-create')
            .addEventListener('click', this.#openCreateWorkspace);
        this.parent
            .querySelector('#create-workspace')
            .addEventListener('click', this.#closeCreateWorkspace);
        this.parent
            .querySelector('input[data-name=workspace-name]')
            .addEventListener('input', this.#blockCreateButton);
        window.addEventListener('resize', this.#resize);
    }

    removeEventListeners() {
        this.parent
            .querySelector('.btn-create-workspace-pop-up')
            .removeEventListener('click', this.#createWorkspace);
        this.parent
            .querySelector('.container-main')
            ?.removeEventListener('click', this.#openCreateWorkspace);
        this.parent
            .querySelector('.menu__btn-create')
            .removeEventListener('click', this.#openCreateWorkspace);
        this.parent
            .querySelector('#create-workspace')
            .removeEventListener('click', this.#closeCreateWorkspace);
        this.parent
            .querySelector('input[data-name=workspace-name]')
            .removeEventListener('input', this.#blockCreateButton);
        window.removeEventListener('resize', this.#resize);
    }

    #blockCreateButton = (e) => {
        e.preventDefault();
        const btn = this.parent.querySelector('.btn-create-workspace-pop-up');

        if (e.target.value.length === 0) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
    };

    #openCreateWorkspace = (e) => {
        if (
            e.target.closest('.btn-create-workspace') ||
            e.target.closest('.btn-create-first-workspace') ||
            e.target.closest('.menu__btn-create')
        ) {
            e.preventDefault();
            e.stopPropagation();

            this.#clearForm();
            const dialog = this.parent.querySelector('#create-workspace');

            if (!dialog.hasAttribute('open')) {
                popupEvent.closeAllPopups(e);
                popupEvent.addPopup(dialog);
                dialog.showModal();
                const dialogSizes = dialog.getBoundingClientRect();
                const windowSizes = this.parent.getBoundingClientRect();

                dialog.setAttribute(
                    'style',
                    `top: ${5}%; left: ${Math.floor(
                        (windowSizes.width - dialogSizes.width) / 2,
                    )}px`,
                );
            } else {
                popupEvent.deletePopup(dialog);
                dialog.close();
            }
        }
    };

    #clearForm = () => {
        const dialog = this.parent.querySelector('#create-workspace');
        const form = dialog.querySelector('.form__create-workspace');
        form.reset();

        const input = dialog.querySelector('.input-workspace-name');
        const btnCreate = dialog.querySelector('.btn-create-workspace-pop-up');

        if (input.value.length === 0) {
            btnCreate.disabled = true;
        } else {
            btnCreate.disabled = false;
        }
    };

    #closeCreateWorkspace = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.target === e.currentTarget) {
            popupEvent.closeAllPopups();
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
            this.#openCreateWorkspace(e);

            dispatcher.dispatch(actionNavigate(window.location.pathname, '', true));
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
                text: 'Неккоректное название рабочего пространства',
            });
        }
    };

    #resize = () => {
        const dialog = this.parent.querySelector('#create-workspace');

        window.requestAnimationFrame(() => {
            const dialogSizes = dialog.getBoundingClientRect();
            const windowSizes = this.parent.getBoundingClientRect();

            dialog.setAttribute(
                'style',
                `top: ${5}%; left: ${Math.floor((windowSizes.width - dialogSizes.width) / 2)}px`,
            );
        });
    };
}
