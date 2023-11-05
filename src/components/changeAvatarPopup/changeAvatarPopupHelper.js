const changeAvatarPopupAction = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const dialog = document.querySelector('#change-avatar');

    if (dialog.getAttribute('open') === '') {
        dialog.close();
    } else {
        dialog.show();
    }
};

export default changeAvatarPopupAction;
