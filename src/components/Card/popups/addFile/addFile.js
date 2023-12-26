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
    static #file;

    static #filename;

    static #mimetype;

    static #fileTypes = [
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
                fileTypes: AddFile.#fileTypes.join(', '),
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
            .addEventListener('click', AddFile.#clearForm);
        this.parent.querySelector('#card').addEventListener('click', this.#deleteFile);
        this.parent
            .querySelector('.card-data__card-information')
            .addEventListener('click', this.#uploadFileByUser);
        window.addEventListener('resize', this.#resize);
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
            .removeEventListener('click', AddFile.#clearForm);
        this.parent.querySelector('#card').removeEventListener('click', this.#deleteFile);
        this.parent
            .querySelector('.card-data__card-information')
            .removeEventListener('click', this.#uploadFileByUser);
        window.removeEventListener('resize', this.#resize);
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
                const windowWidth = window.innerWidth;
                if (windowWidth - (btnCoordinates.left + dialogSizes.width) < 50) {
                    dialog.setAttribute(
                        'style',
                        `top: ${btnCoordinates.top + btnCoordinates.height + 10}px; left: ${
                            windowWidth - dialogSizes.width
                        }px`,
                    );
                } else {
                    dialog.setAttribute(
                        'style',
                        `top: ${btnCoordinates.top + btnCoordinates.height + 10}px; left: ${
                            btnCoordinates.left
                        }px`,
                    );
                }
            } else {
                popupEvent.deletePopup(dialog);
                dialog.close();
            }
        }
    };

    #resize = () => {
        window.requestAnimationFrame(() => {
            const dialog = this.parent.querySelector('#card-file');
            if (dialog.hasAttribute('open')) {
                const btnCoordinates = this.parent
                    .querySelector('button[data-action="manage-card-files"]')
                    .getBoundingClientRect();
                const dialogSizes = dialog.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                if (windowWidth - (btnCoordinates.left + dialogSizes.width) < 50) {
                    dialog.setAttribute(
                        'style',
                        `top: ${btnCoordinates.top + btnCoordinates.height + 10}px; left: ${
                            windowWidth - dialogSizes.width
                        }px`,
                    );
                } else {
                    dialog.setAttribute(
                        'style',
                        `top: ${btnCoordinates.top + btnCoordinates.height + 10}px; left: ${
                            btnCoordinates.left
                        }px`,
                    );
                }
            }
        });
    };

    #closePopupByBackground = (e) => {
        e.stopPropagation();

        if (e.target === e.currentTarget) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
            AddFile.clearPopup();
        }
    };

    #chooseFileAction = (e) => {
        e.stopPropagation();

        this.parent.querySelector('.input-upload-file').click();
    };

    #previewFile = (e) => {
        e.stopPropagation();

        const file = this.parent.querySelector('.input-upload-file').files[0];
        AddFile.file = structuredClone(file);
        AddFile.filename = file.name;
        AddFile.mimetype = file.type;

        const filename = this.parent.querySelector('.card-file__filename');
        filename.removeAttribute('style');
        filename.textContent = AddFile.filename;

        this.parent.querySelector('.upload-card-file').setAttribute('style', 'display: none');
    };

    #uploadFile = async (e) => {
        e.stopPropagation();

        if (AddFile.#file) {
            const cardId = this.parent.querySelector('#card').dataset.card;
            const file = await readFileAsByteArray(AddFile.#file);

            await dispatcher.dispatch(
                actionAttachFile({
                    task_id: parseInt(cardId, 10),
                    filename: AddFile.#filename,
                    file: Array.from(file.values()),
                    mimetype: AddFile.#mimetype,
                }),
            );
        }
    };

    static clearPopup = () => {
        AddFile.#clearFile();
        AddFile.#clearForm();
    }

    static #clearForm = (e) => {
        e?.stopPropagation();

        const form = document.querySelector('.upload-card-file');
        form.reset();
        form.removeAttribute('style');

        const filename = document.querySelector('.card-file__filename');
        filename.setAttribute('style', 'display: none');
        filename.textContent = '';

        AddFile.#clearFile();
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

    static #clearFile = () => {
        AddFile.#file = null;
        AddFile.#filename = null;
        AddFile.#mimetype = null;
    };
}
