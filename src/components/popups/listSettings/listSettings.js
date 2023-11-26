import { actionDeleteList, actionUpdateList } from '../../../actions/boardActions.js';
import { actionDeleteWorkspace } from '../../../actions/workspaceActions.js';
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
        this.parent.querySelectorAll('.btn-change-list').forEach((btn) => {
            btn.addEventListener('click', this.#openSettings);
        });
        // this.parent
        //     .querySelector('.btn-change-workspace-name')
        //     .addEventListener('click', this.#renameWorkspace);
        this.parent
            .querySelector('.btn-delete-list')
            .addEventListener('click', this.#deleteListHandler);
        this.parent.querySelectorAll('.list__title').forEach((name) => {
            name.addEventListener('keydown', this.#changeNameHandler);
        });
        // window.addEventListener('resize', this.#resize);
    }

    removeEventListeners() {
        this.parent.querySelectorAll('.btn-change-list').forEach((btn) => {
            btn.removeEventListener('click', this.#openSettings);
        });
        this.parent.querySelectorAll('.list__title').forEach((name) => {
            name.addEventListener('keydown', this.#changeNameHandler);
        });
        this.parent
            .querySelector('.btn-delete-list')
            .addEventListener('click', this.#deleteListHandler);
    }

    #renameList = () => {
        const dialog = document.querySelector('#list-settings');

        if (dialog.dataset.list) {
            const listName = document.querySelector(
                `.list-title[data-list="${dialog.dataset.list}"]`,
            );
            listName.focus();
            popupEvent.deletePopup(dialog);
            dialog.close();
        }
    };

    #openSettings = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dialog = document.querySelector('#list-settings');

        const btnCoordinates = e.target.closest('button').getBoundingClientRect();
        const listId = e.target.closest('button').dataset.list;

        if (dialog.getAttribute('open') !== null) {
            popupEvent.deletePopup(dialog);
            dialog.close();
            console.log(popupEvent);
            if (listId !== dialog.dataset.list) {
                popupEvent.addPopup(dialog);
                dialog.show();
                popupEvent.closeOtherPopups(dialog);
                dialog.setAttribute(
                    'style',
                    `top: ${btnCoordinates.top - 10}px; left: ${
                        btnCoordinates.left + btnCoordinates.width + 20
                    }px`,
                );
            }
        } else {
            popupEvent.addPopup(dialog);
            dialog.show();
            popupEvent.closeOtherPopups(dialog);
            dialog.setAttribute(
                'style',
                `top: ${btnCoordinates.top - 10}px; left: ${
                    btnCoordinates.left + btnCoordinates.width + 20
                }px`,
            );
        }
        dialog.dataset.list = listId;
    };

    #resize = () => {
        const dialog = document.querySelector('#list-settings');

        if (dialog.dataset.workspace) {
            const btnCoordinates = document
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

    #deleteListHandler = () => {
        const dialog = this.parent.querySelector('#list-settings');
        if (dialog.dataset.list) {
            const listId = parseInt(dialog.dataset.list, 10);
            popupEvent.deletePopup(dialog);
            dialog.close();
            dispatcher.dispatch(actionDeleteList(listId));
        }
    };

    #changeNameHandler = async (e) => {
        e.stopPropagation();

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
    };
}
