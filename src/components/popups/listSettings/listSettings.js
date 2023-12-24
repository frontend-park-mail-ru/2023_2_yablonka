import { actionDeleteList, actionUpdateList } from '../../../actions/boardActions.js';
import dispatcher from '../../../modules/dispatcher.js';
import BoardPage from '../../../pages/Board/board.js';
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
        this.parent.querySelector('.board').addEventListener('focusout', this.#changeListName);
        this.parent.querySelector('.board').addEventListener('keydown', this.#enterButtonHandler);
    }

    removeEventListeners() {
        this.parent.querySelector('.board').removeEventListener('click', this.#openSettings);
        this.parent
            .querySelector('.btn-change-list-name')
            .removeEventListener('click', this.#renameList);
        this.parent
            .querySelector('.btn-delete-list')
            .addEventListener('click', this.#deleteListHandler);
        this.parent.querySelector('.board').removeEventListener('focusout', this.#changeListName);
        this.parent
            .querySelector('.board')
            .removeEventListener('keydown', this.#enterButtonHandler);
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
        if (e.target.closest('.btn-change-list')) {
            e.stopPropagation();
            e.preventDefault();

            BoardPage.closeAllCreateMenu();

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

    #enterButtonHandler = (e) => {
        if (e.target.closest('.list__title')) {
            if (e.key === 'Enter') {
                e.stopPropagation();
                e.preventDefault();
                e.target.closest('.list__title').blur();
            } else if (e.key === 'Escape') {
                e.stopPropagation();
                e.preventDefault();
                const listName = e.target.closest('.list__title');
                listName.textContent = workspaceStorage.getListById(
                    parseInt(listName.dataset.list, 10),
                ).name;
                listName.blur();
            }
        }
    };

    static resizeListsName = () => {
        window.requestAnimationFrame(() => {
            document.querySelectorAll('.list__title-wrapper').forEach((listName) => {
                const name = listName.querySelector('.list__title');
                const settingsBtn = listName.querySelector('.btn-change-list');

                name.setAttribute(
                    'style',
                    `max-width: ${
                        settingsBtn.getBoundingClientRect().left -
                        name.getBoundingClientRect().left -
                        10
                    }px`,
                );
            });
        });
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

    #changeListName = async (e) => {
        if (e.target.closest('.list__title')) {
            e.stopPropagation();
            e.preventDefault();

            const listId = e.target.closest('.list').dataset.list;
            const { name, listPosition } = workspaceStorage.getListById(parseInt(listId, 10));

            const newName = e.target.closest('.list__title').textContent;
            if (newName !== '' && newName !== name) {
                await dispatcher.dispatch(
                    actionUpdateList({
                        id: parseInt(listId, 10),
                        name: newName,
                        list_position: listPosition,
                    }),
                );
            } else {
                e.target.textContent = name;
            }
        }
    };
}
