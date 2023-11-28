import { actionUpdateAvatar } from '../../../actions/userActions.js';
import dispatcher from '../../../modules/dispatcher.js';
import Component from '../../core/basicComponent.js';
import popupEvent from '../../core/popeventProcessing.js';
import template from './uploadAvatar.hbs';
import './uploadAvatar.scss';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class UploadAvatarModal extends Component {
    avatarFile;

    readFileAsByteArray(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const byteArray = new Uint8Array(arrayBuffer);
                resolve(byteArray);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
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

    removeEventListeners() {
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

    #changeForm = (from, to) => {
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

    #openModal = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = document.querySelector('#upload-avatar');

        if (dialog.getAttribute('open') === null) {
            popupEvent.closeAllPopups();
            popupEvent.addPopup(dialog);
            dialog.showModal();
            this.avatarFile = null;
        } else {
            popupEvent.deletePopup(dialog);
            dialog.close();
            this.avatarFile = null;
        }
    };

    #closeModal = (e) => {
        // const dialog = document.querySelector('#upload-avatar');

        if (e.target === e.currentTarget) {
            this.#changeForm('none', 'flex');
            popupEvent.closeAllPopups();
            this.avatarFile = null;
        }
    };

    #chooseFileAction = (e) => {
        e.stopPropagation();

        document.querySelector('.input-upload-avatar').click();
    };

    #previewAvatar = (e) => {
        e.stopPropagation();

        const file = document.querySelector('.input-upload-avatar').files[0];
        this.avatarFile = structuredClone(file);
        const previewImage = document.querySelector('.avatar-preview__image');

        if (file) {
            previewImage.style.display = 'block';
            previewImage.src = URL.createObjectURL(file);
            this.#changeForm('flex', 'none');
        }
    };

    #revertChanges = (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
        e.stopPropagation();

        this.#changeForm('none', 'flex');
    };

    #updateAvatar = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const avatar = await this.readFileAsByteArray(this.avatarFile);

        dispatcher.dispatch(
            actionUpdateAvatar({
                avatar,
            }),
        );

        this.#changeForm('none', 'flex');
    };
}
