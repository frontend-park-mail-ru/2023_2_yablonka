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

    closeOtherPopups = (popup) => {
        document.querySelectorAll('dialog').forEach((el) => {
            if (el !== popup) {
                el.close();
            }
        });
    };

    closeAllPopups = (e) => {
        document.querySelectorAll('dialog').forEach((el) => {
            if (!e.target.closest('dialog')) {
                el.close();
            }
        });
    };
}

const popupEvent = new PopupEvent();

export default popupEvent;
