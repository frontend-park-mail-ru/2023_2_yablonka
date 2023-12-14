/**
 * Класс для обработки pop up's
 * @class
 */
class PopupEvent {
    constructor() {
        this.components = [];
    }

    /**
     * Функция для добавления в буфер активного pop up
     * @param {HTMLElement} popup - активноый pop up
     */
    addPopup = (popup) => {
        this.components.push(popup);
    };

    /**
     * Функция для удаления из буфера активного pop up
     * @param {HTMLElement} popup - активноый pop up
     */
    deletePopup = (popup) => {
        this.components.splice(this.components.indexOf(popup), 1);
    };

    /**
     * Функция для очистки буфура
     */
    clearPopups = () => {
        this.components = [];
    };

    /**
     * Функция для закрытия всех активных pop up, кроме выбранного
     * @param {HTMLElement} popup - выбранный pop up
     */
    closeOtherPopups = (popups) => {
        document.querySelectorAll('dialog').forEach((el) => {
            if (!popups.includes(el)) {
                el.close();
                this.deletePopup(el);
            }
        });
    };

    /**
     * Функция для закрытия всех активных pop up
     * @param {Event} e - событие
     */
    closeAllPopups = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();

            if (e.target.closest('dialog')) {
                return;
            }
        }

        document.querySelectorAll('dialog').forEach((el) => {
            el.close();
        });
        this.clearPopups();
    };
}

const popupEvent = new PopupEvent();

export default popupEvent;
