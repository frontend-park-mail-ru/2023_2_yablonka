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

    filename;

    mimetype;

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
        this.parent
            .querySelector('.btn-profile[data-action=open-upload-avatar-modal]')
            .addEventListener('click', this.#openModal);
        this.parent
            .querySelector('.btn-upload-avatar')
            .addEventListener('click', this.#chooseFileAction);
        this.parent
            .querySelector('.input-upload-avatar')
            .addEventListener('change', this.#previewAvatar);
        this.parent
            .querySelector('.btn-revert-change-avatar')
            .addEventListener('click', this.#revertChanges);
        this.parent
            .querySelector('.upload-avatar-modal__button_cancel')
            .addEventListener('click', this.#openModal);
        this.parent.querySelector('#upload-avatar').addEventListener('click', this.#closeModal);
        this.parent
            .querySelector('.upload-avatar-modal__button_upload')
            .addEventListener('click', this.#updateAvatar);
        window.addEventListener('resize', this.#resize);
    }

    removeEventListeners() {
        this.parent
            .querySelector('.btn-profile[data-action=open-upload-avatar-modal]')
            .removeEventListener('click', this.#openModal);
        this.parent
            .querySelector('.btn-upload-avatar')
            .removeEventListener('click', this.#chooseFileAction);
        this.parent
            .querySelector('.input-upload-avatar')
            .removeEventListener('change', this.#previewAvatar);
        this.parent
            .querySelector('.btn-revert-change-avatar')
            .removeEventListener('click', this.#revertChanges);
        this.parent
            .querySelector('.upload-avatar-modal__button_cancel')
            .removeEventListener('click', this.#closeModal);
        this.parent.querySelector('#upload-avatar').removeEventListener('click', this.#closeModal);
        this.parent
            .querySelector('.upload-avatar-modal__button_upload')
            .removeEventListener('click', this.#updateAvatar);
        window.removeEventListener('resize', this.#resize);
    }

    #changeForm = (from, to) => {
        const form = this.parent.querySelector('.form-upload-avatar');

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

        const dialog = this.parent.querySelector('#upload-avatar');

        if (dialog.getAttribute('open') === null) {
            popupEvent.closeAllPopups();
            popupEvent.addPopup(dialog);
            dialog.showModal();
            const dialogSizes = dialog.getBoundingClientRect();
            const windowSizes = this.parent.getBoundingClientRect();

            dialog.setAttribute(
                'style',
                `top: ${5}%; left: ${Math.floor((windowSizes.width - dialogSizes.width) / 2)}px`,
            );
            this.#clearFile();
        } else {
            popupEvent.deletePopup(dialog);
            dialog.close();
            this.#clearFile();
        }
    };

    #closeModal = (e) => {
        // const dialog = this.parent.querySelector('#upload-avatar');

        if (e.target === e.currentTarget) {
            this.#changeForm('none', 'flex');
            popupEvent.closeAllPopups();
            this.#clearFile();
        }
    };

    #clearFile = () => {
        this.avatarFile = null;
        this.filename = null;
        this.mimetype = null;
    };

    #chooseFileAction = (e) => {
        e.stopPropagation();

        this.parent.querySelector('.input-upload-avatar').click();
    };

    #previewAvatar = (e) => {
        e.stopPropagation();

        const file = this.parent.querySelector('.input-upload-avatar').files[0];
        this.avatarFile = structuredClone(file);
        this.filename = file.name;
        this.mimetype = file.type;
        const previewImage = this.parent.querySelector('.avatar-preview__image');

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

        if (!this.parent.querySelector('.profile-user-image').src.includes('avatar.jpg')) {
            dispatcher.dispatch(
                actionUpdateAvatar({
                    avatar: Array.from(avatar.values()),
                    filename: this.filename,
                    mimetype: this.mimetype,
                }),
            );
        }

        this.#clearFile();

        this.#changeForm('none', 'flex');
    };

    #resize = () => {
        const dialog = this.parent.querySelector('#upload-avatar');

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
