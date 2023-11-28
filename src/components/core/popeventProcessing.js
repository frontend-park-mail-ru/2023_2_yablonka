class PopupEvent {
    constructor() {
        this.components = [];
    }

    addPopup = (popup) => {
        this.components.push(popup);
    };

    deletePopup = (popup) => {
        this.components.splice(this.components.indexOf(popup), 1);
    };

    clearPopups = () => {
        this.components = [];
    };

    closeOtherPopups = (popups) => {
        document.querySelectorAll('dialog').forEach((el) => {
            if (!popups.includes(el)) {
                el.close();
                this.deletePopup(el);
            }
        });
    };

    closeAllPopups = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        document.querySelectorAll('dialog').forEach((el) => {
            el.close();
        });
        this.clearPopups();
    };
}

const popupEvent = new PopupEvent();

export default popupEvent;
