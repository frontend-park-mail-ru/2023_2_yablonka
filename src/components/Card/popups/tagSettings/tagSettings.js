import { actionDeleteTag, actionDetachTag } from '../../../../actions/boardActions.js';
import dispatcher from '../../../../modules/dispatcher.js';
import workspaceStorage from '../../../../storages/workspaceStorage.js';
import List from '../../../Board/board/atomic/list/list.js';
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
    static filteredTag;

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
        this.parent
            .querySelector('.btn-filter-cards')
            .addEventListener('click', TagSettings.filterCards);
        this.parent.querySelector('.btn-unpin-tag').addEventListener('click', this.#unpinTag);
        this.parent.querySelector('.btn-delete-tag').addEventListener('click', this.#deleteTag);
    }

    removeEventListeners() {
        this.parent.querySelector('#card').removeEventListener('click', this.#openTagMenu);
        this.parent
            .querySelector('#tag-settings')
            .removeEventListener('click', this.#closePopupByBackground);
        this.parent
            .querySelector('.btn-filter-cards')
            .removeEventListener('click', TagSettings.filterCards);
        this.parent.querySelector('.btn-unpin-tag').removeEventListener('click', this.#unpinTag);
        this.parent.querySelector('.btn-delete-tag').removeEventListener('click', this.#deleteTag);
    }

    #openTagMenu = (e) => {
        if (e.target.closest('.card-tag')) {
            e.stopPropagation();
            e.preventDefault();

            const dialog = this.parent.querySelector('#tag-settings');

            const btn = e.target.closest('.card-tag');
            const btnSizes = btn.getBoundingClientRect();

            const tagName = btn.dataset.tag;

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
            }
            dialog.dataset.tag = tagName;
        }
    };

    #closePopupByBackground = (e) => {
        e.stopPropagation();

        if (e.target === e.currentTarget) {
            popupEvent.closeOtherPopups([this.parent.querySelector('#card')]);
        }
    };

    #unpinTag = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        const cardId = parseInt(this.parent.querySelector('#card').dataset.card, 10);
        const dialog = this.parent.querySelector('#tag-settings');
        const tag = workspaceStorage.getTagOnBoard(dialog.dataset.tag);

        if (tag) {
            await dispatcher.dispatch(
                actionDetachTag({
                    tag_id: parseInt(tag.id, 10),
                    task_id: cardId,
                }),
            );
        }
    };

    #deleteTag = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        const cardId = parseInt(this.parent.querySelector('#card').dataset.card, 10);
        const dialog = this.parent.querySelector('#tag-settings');
        const tag = workspaceStorage.getTagOnBoard(dialog.dataset.tag);

        if (tag) {
            await dispatcher.dispatch(
                actionDeleteTag({
                    tag_id: parseInt(tag.id, 10),
                    task_id: cardId,
                }),
            );
        }
    };

    static removeTagFromCard = (tag) => {
        const dialog = document.querySelector('#card');
        const tagElement = dialog.querySelector(`.card-tag[data-tag="${tag.name}"]`);

        tagElement.remove();
    };

    static filterCards = (e) => {
        e?.stopPropagation();
        e?.preventDefault();

        const resetFilterBtn = document.querySelector('.btn-filter-action');
        resetFilterBtn.removeAttribute('disabled');

        const { tag } =
            e.target.closest('.btn-list-card__tag')?.dataset ??
            document.querySelector('#tag-settings').dataset;
        if (e) {
            TagSettings.filteredTag = tag;
        }

        const filteredLists = workspaceStorage.filterCardsByTag(TagSettings.filteredTag);
        const listsContainer = document.querySelector('.board__lists');

        listsContainer.innerHTML = '';
        filteredLists.forEach((list) => {
            listsContainer.insertAdjacentHTML('beforeend', new List(null, list).render());
        });
    };
}
