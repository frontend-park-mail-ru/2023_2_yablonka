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
        if (e && !e.target.closest('a').hasAttribute('download')) {
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
