const navigationPopupAction = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const dialog = document.querySelector('#navigation-menu');

    if (dialog.getAttribute('open') === '') {
        dialog.close();
    } else {
        dialog.show();
    }
};

export default navigationPopupAction;
