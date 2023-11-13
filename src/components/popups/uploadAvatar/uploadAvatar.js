import { actionUpdateAvatar } from '../../../actions/userActions.js';
import dispatcher from '../../../modules/dispatcher.js';
import userStorage from '../../../storages/userStorage.js';
import Component from '../../core/basicComponent.js';
import template from './uploadAvatar.hbs';
import './uploadAvatar.scss';
/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class UploadAvatarModal extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    static addEventListeners() {
        document
            .querySelector('.btn-profile[data-action=open-upload-avatar-modal]')
            .addEventListener('click', this.#openModal);
        document
            .querySelector('.btn-upload-avatar')
            .addEventListener('click', this.#chooseFileAction);
        document
            .querySelector('.input-upload-avatar')
            .addEventListener('change', this.#previewAvatar);
        document
            .querySelector('.btn-revert-change-avatar')
            .addEventListener('click', this.#revertChanges);
        document
            .querySelector('.upload-avatar-modal__button_cancel')
            .addEventListener('click', this.#openModal);
        document.querySelector('#upload-avatar').addEventListener('click', this.#closeModal);
        document
            .querySelector('.upload-avatar-modal__button_upload')
            .addEventListener('click', this.#updateAvatar);
    }

    static removeEventListeners() {
        document
            .querySelector('.btn-profile[data-action=open-upload-avatar-modal]')
            .removeEventListener('click', this.#openModal);
        document
            .querySelector('.btn-upload-avatar')
            .removeEventListener('click', this.#chooseFileAction);
        document
            .querySelector('.input-upload-avatar')
            .removeEventListener('change', this.#previewAvatar);
        document
            .querySelector('.btn-revert-change-avatar')
            .removeEventListener('click', this.#revertChanges);
        document
            .querySelector('.upload-avatar-modal__button_cancel')
            .removeEventListener('click', this.#closeModal);
        document.querySelector('#upload-avatar').removeEventListener('click', this.#closeModal);
        document
            .querySelector('.upload-avatar-modal__button_upload')
            .removeEventListener('click', this.#updateAvatar);
    }

    static #changeForm = (from, to) => {
        const form = document.querySelector('.form-upload-avatar');

        Array.from(form.children).forEach((e, ind) => {
            if (ind !== form.children.length - 1) {
                e.style.display = to;
            } else {
                e.style.display = from;
            }
        });
        form.reset();
    };

    static #openModal = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = document.querySelector('#upload-avatar');
        const prevDialog = document.querySelector('#change-avatar');

        if (dialog.getAttribute('open') === '') {
            dialog.close();
        } else {
            dialog.showModal();
            prevDialog.close();
        }
    };

    static #closeModal = (e) => {
        const dialog = document.querySelector('#upload-avatar');

        if (e.target === e.currentTarget) {
            this.#changeForm('none', 'flex');
            dialog.close();
        }
    };

    static #chooseFileAction = (e) => {
        e.stopPropagation();

        document.querySelector('.input-upload-avatar').click();
    };

    static #previewAvatar = (e) => {
        e.stopPropagation();

        const [file] = document.querySelector('.input-upload-avatar').files;
        const previewImage = document.querySelector('.avatar-preview__image');

        if (file) {
            this.#changeForm('flex', 'none');

            previewImage.style.display = 'block';
            previewImage.src = URL.createObjectURL(file);
        }
    };

    static #revertChanges = (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
        e.stopPropagation();

        this.#changeForm('none', 'flex');
    };

    static #updateAvatar = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const [file] = document.querySelector('.input-upload-avatar').files;

        const formData = new FormData();
        formData.append('avatar', file);
        formData.append(
            'user_id',
            userStorage.storage.get(userStorage.userModel.body).body.user.user_id,
        );

        dispatcher.dispatch(actionUpdateAvatar(formData));

        this.#changeForm('none', 'flex');
    };
}
