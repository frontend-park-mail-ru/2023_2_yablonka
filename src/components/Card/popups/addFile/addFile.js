import dispatcher from '../../../../modules/dispatcher.js';
import readFileAsByteArray from '../../../../modules/files.js';
import Component from '../../../core/basicComponent.js';
import popupEvent from '../../../core/popeventProcessing.js';
import template from './addFile.hbs';
import './addFile.scss';
import { actionAttachFile, actionDeleteFile } from '../../../../actions/boardActions.js';

/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class AddFile extends Component {
    file;

    filename;

    mimetype;

    fileTypes = [
        'application/pdf',
        'text/plain',
        'application/zip',
        'application/vnd.rar',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'image/gif',
        'image/jpeg',
        'image/png',
    ];

    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML(
            'beforeend',
            template({
                fileTypes: this.fileTypes.reduce((acc, type) => `${acc}, ${type}`),
            }),
        );
    }

    addEventListeners() {
        this.parent
            .querySelector('button[data-action=manage-card-files]')
            .addEventListener('click', this.#openPopup);
        this.parent
            .querySelector('#card-file')
            .addEventListener('click', this.#closePopupByBackground);
        this.parent
            .querySelector('.btn-upload-file')
            .addEventListener('click', this.#chooseFileAction);
        this.parent
            .querySelector('.input-upload-file')
            .addEventListener('change', this.#previewFile);
        this.parent
            .querySelector('.btn-attach-file_upload')
            .addEventListener('click', this.#uploadFile);
        this.parent
            .querySelector('.btn-attach-file_cancel')
            .addEventListener('click', this.#clearForm);
        this.parent.querySelector('#card').addEventListener('click', this.#deleteFile);
        this.parent
            .querySelector('.card-data__card-information')
            .addEventListener('click', this.#uploadFileByUser);
    }

    removeEventListeners() {
        this.parent
            .querySelector('button[data-action=manage-card-files]')
            .removeEventListener('click', this.#openPopup);
        this.parent
            .querySelector('#card-file')
            .removeEventListener('click', this.#closePopupByBackground);
        this.parent
            .querySelector('.btn-upload-file')
            .removeEventListener('click', this.#chooseFileAction);
        this.parent
            .querySelector('.input-upload-file')
            .removeEventListener('change', this.#previewFile);
        this.parent
            .querySelector('.btn-attach-file_upload')
            .removeEventListener('click', this.#uploadFile);
        this.parent
            .querySelector('.btn-attach-file_cancel')
            .removeEventListener('click', this.#clearForm);
        this.parent.querySelector('#card').removeEventListener('click', this.#deleteFile);
        this.parent
            .querySelector('.card-data__card-information')
            .removeEventListener('click', this.#uploadFileByUser);
    }

    #openPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cardId = parseInt(this.parent.querySelector('#card').dataset.card, 10);
        const dialog = this.parent.querySelector('#card-file');
        const btnCoordinates = e.target.closest('button').getBoundingClientRect();

        if (cardId) {
            if (!dialog.hasAttribute('open')) {
                popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
                popupEvent.addPopup(dialog);
                dialog.showModal();
                const dialogSizes = dialog.getBoundingClientRect();
                dialog.setAttribute(
                    'style',
                    `top: ${btnCoordinates.y - Math.floor(dialogSizes.height / 3)}px; left: ${
                        btnCoordinates.x - 10
                    }px`,
                );
            } else {
                popupEvent.deletePopup(dialog);
                dialog.close();
            }
        }
    };

    #closePopupByBackground = (e) => {
        e.stopPropagation();

        if (e.target === e.currentTarget) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
            this.#clearForm();
            this.#clearFile();
        }
    };

    #chooseFileAction = (e) => {
        e.stopPropagation();

        this.parent.querySelector('.input-upload-file').click();
    };

    #previewFile = (e) => {
        e.stopPropagation();

        const file = this.parent.querySelector('.input-upload-file').files[0];
        this.file = structuredClone(file);
        this.filename = file.name;
        this.mimetype = file.type;

        const filename = this.parent.querySelector('.card-file__filename');
        filename.removeAttribute('style');
        filename.textContent = this.filename;

        this.parent.querySelector('.upload-card-file').setAttribute('style', 'display: none');
    };

    #uploadFile = async (e) => {
        e.stopPropagation();

        if (this.file) {
            const cardId = this.parent.querySelector('#card').dataset.card;
            const file = await readFileAsByteArray(this.file);

            await dispatcher.dispatch(
                actionAttachFile({
                    task_id: parseInt(cardId, 10),
                    filename: this.filename,
                    file: Array.from(file.values()),
                    mimetype: this.mimetype,
                }),
            );

            this.#clearFile();
            this.#clearForm();
        }
    };

    #clearForm = (e) => {
        e?.stopPropagation();

        const form = this.parent.querySelector('.upload-card-file');
        form.reset();
        form.removeAttribute('style');

        const filename = this.parent.querySelector('.card-file__filename');
        filename.setAttribute('style', 'display: none');
        filename.textContent = '';

        this.#clearFile();
    };

    #uploadFileByUser = (e) => {
        if (e.target.closest('.card-information__file-wrapper') && e.target.closest('a')) {
            e.stopPropagation();
        }
    };

    #deleteFile = async (e) => {
        if (e.target.closest('.btn-file-actions_delete')) {
            e.stopPropagation();

            const file = e.target.closest('.card-information__file-wrapper');

            await dispatcher.dispatch(
                actionDeleteFile({
                    file_path: file
                        .querySelector('.card-file-download')
                        .href.replace(`${window.origin}/`, ''),
                    original_name: file.querySelector('.card-information__filename').textContent,
                    task_id: parseInt(e.target.closest('#card').dataset.card, 10),
                }),
            );
        }
    };

    #clearFile = () => {
        this.file = null;
        this.filename = null;
        this.mimetype = null;
    };
}
