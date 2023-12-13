import { actionDeleteList, actionUpdateList } from '../../../actions/boardActions.js';
import dispatcher from '../../../modules/dispatcher.js';
import workspaceStorage from '../../../storages/workspaceStorage.js';
import Component from '../../core/basicComponent.js';
import popupEvent from '../../core/popeventProcessing.js';
import template from './listSettings.hbs';
import './listSettings.scss';
/**
 * Попап для хедера
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class ListSettings extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', template(this.config));
    }

    addEventListeners() {
        this.parent.querySelector('.board').addEventListener('click', this.#openSettings);
        this.parent
            .querySelector('.btn-change-list-name')
            .addEventListener('click', this.#renameList);
        this.parent
            .querySelector('.btn-delete-list')
            .addEventListener('click', this.#deleteListHandler);
        this.parent.querySelector('.board').addEventListener('keydown', this.#changeNameHandler);
    }

    removeEventListeners() {
        this.parent.querySelector('.board').removeEventListener('click', this.#openSettings);
        this.parent
            .querySelector('.btn-change-list-name')
            .removeEventListener('click', this.#renameList);
        this.parent
            .querySelector('.btn-delete-list')
            .addEventListener('click', this.#deleteListHandler);
        this.parent.querySelector('.board').removeEventListener('keydown', this.#changeNameHandler);
    }

    #renameList = () => {
        const dialog = this.parent.querySelector('#list-settings');

        if (dialog.dataset.list) {
            const listName = this.parent.querySelector(
                `.list__title[data-list="${dialog.dataset.list}"]`,
            );
            listName.focus();

            popupEvent.deletePopup(dialog);
            dialog.close();
        }
    };

    #openSettings = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.target.closest('.btn-change-list')) {
            const dialog = this.parent.querySelector('#list-settings');

            const btn = e.target.closest('button');
            const btnCoordinates = btn.getBoundingClientRect();
            const listId = parseInt(btn.closest('button').dataset.list, 10);

            if (!dialog.hasAttribute('open')) {
                popupEvent.closeAllPopups();
                popupEvent.addPopup(dialog);
                dialog.show();
                dialog.setAttribute(
                    'style',
                    `top: ${btnCoordinates.top - 10}px; left: ${
                        btnCoordinates.left + btnCoordinates.width + 20
                    }px`,
                );
            } else {
                popupEvent.deletePopup(dialog);
                dialog.close();
                if (listId !== parseInt(dialog.dataset.list, 10)) {
                    popupEvent.closeAllPopups();
                    popupEvent.addPopup(dialog);
                    dialog.show();
                    dialog.setAttribute(
                        'style',
                        `top: ${btnCoordinates.top - 10}px; left: ${
                            btnCoordinates.left + btnCoordinates.width + 20
                        }px`,
                    );
                }
            }
            dialog.dataset.list = listId;
        }
    };

    #resize = () => {
        const dialog = this.parent.querySelector('#list-settings');

        if (dialog.dataset.workspace) {
            const btnCoordinates = this.parent
                .querySelector(`.btn-change-list[data-list="${dialog.dataset.workspace}"]`)
                .getBoundingClientRect();
            dialog.setAttribute(
                'style',
                `top: ${btnCoordinates.top - 10}px; left: ${
                    btnCoordinates.left + btnCoordinates.width + 20
                }px`,
            );
        }
    };

    #deleteListHandler = (e) => {
        const dialog = e.target.closest('#list-settings');
        if (dialog.dataset.list) {
            const listId = parseInt(dialog.dataset.list, 10);
            popupEvent.deletePopup(dialog);
            dialog.close();

            dispatcher.dispatch(actionDeleteList({ id: listId }));
        }
    };

    #changeNameHandler = async (e) => {
        e.stopPropagation();

        if (e.target.closest('.list__title')) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const listId = e.target.closest('.list').dataset.list;
                const { name, listPosition } = workspaceStorage.getListById(parseInt(listId, 10));

                const { textContent } = e.target;

                if (textContent !== '' && textContent !== name) {
                    await dispatcher.dispatch(
                        actionUpdateList({
                            id: parseInt(listId, 10),
                            name: textContent,
                            list_position: listPosition,
                        }),
                    );
                } else {
                    e.target.textContent = name;
                }
            }
        }
    };
}
