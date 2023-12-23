import dispatcher from '../../../../modules/dispatcher.js';
import workspaceStorage from '../../../../storages/workspaceStorage.js';
import Component from '../../../core/basicComponent.js';
import popupEvent from '../../../core/popeventProcessing.js';
import template from './tagSettings.hbs';
import './tagSettings.scss';
/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class TagSettings extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        this.parent.querySelector('#card').addEventListener('click', this.#openTagMenu);
        this.parent
            .querySelector('#tag-settings')
            .addEventListener('click', this.#closePopupByBackground);
    }

    removeEventListeners() {
        this.parent.querySelector('#card').removeEventListener('click', this.#openTagMenu);
        this.parent
            .querySelector('#tag-settings')
            .removeEventListener('click', this.#closePopupByBackground);
    }

    #openTagMenu = (e) => {
        if (e.target.closest('.card-tag')) {
            e.stopPropagation();
            e.preventDefault();

            const dialog = this.parent.querySelector('#tag-settings');

            const btn = e.target.closest('.card-tag');
            const btnSizes = btn.getBoundingClientRect();

            const tagId = parseInt(btn.dataset.tag, 10);

            if (!dialog.hasAttribute('open')) {
                popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
                popupEvent.addPopup(dialog);
                dialog.showModal();

                const dialogSizes = dialog.getBoundingClientRect();
                dialog.setAttribute(
                    'style',
                    `top: ${Math.floor(btnSizes.top - dialogSizes.height / 4)}px; left: ${
                        btnSizes.left + btnSizes.width + 20
                    }px`,
                );
            } else {
                popupEvent.deletePopup(dialog);
                dialog.close();
                if (tagId !== parseInt(dialog.dataset.tag, 10)) {
                    popupEvent.closeAllPopups();
                    popupEvent.addPopup(dialog);
                    dialog.showModal();
                    const dialogSizes = dialog.getBoundingClientRect();
                    dialog.setAttribute(
                        'style',
                        `top: ${Math.floor(btnSizes.top - dialogSizes.height / 4)}px; left: ${
                            btnSizes.left + btnSizes.width + 20
                        }px`,
                    );
                }
            }
            dialog.dataset.tag = tagId;
        }
    };

    #closePopupByBackground = (e) => {
        e.stopPropagation();

        if (e.target === e.currentTarget) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
        }
    };
}
