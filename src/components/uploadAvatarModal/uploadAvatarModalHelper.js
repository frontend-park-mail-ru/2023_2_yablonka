export const uploadAvatarModalAction = (e) => {
    e.stopPropagation();

    const form = document.querySelector('.form-upload-avatar');

    Array.from(form.children).forEach((el, ind) => {
        if (ind !== form.children.length - 1) {
            el.style.display = 'flex';
        } else {
            el.style.display = 'none';
        }
    });
    form.reset();

    const dialog = document.querySelector('#upload-avatar');
    const prevDialog = document.querySelector('#change-avatar');

    if (dialog.getAttribute('open') !== '') {
        prevDialog.close();
    }
};

export const chooseFileAvatarModalAction = (e) => {
    e.stopPropagation();

    document.querySelector('.input-upload-avatar').click();
};

export const changeAvatarModalAction = (e) => {
    e.stopPropagation();

    const fileInput = document.querySelector('.input-upload-avatar');
    const [file] = fileInput.files;

    if (file) {
        fileInput.src = URL.createObjectURL(file);
    }
};

export const previewAvatarModalAction = (e) => {
    e.stopPropagation();

    const [file] = document.querySelector('.input-upload-avatar').files;
    const previewImage = document.querySelector('.avatar-preview__image');

    if (file) {
        const formElements = document.querySelector('.form-upload-avatar').children;

        Array.from(formElements).forEach((el, ind) => {
            if (ind !== formElements.length - 1) {
                el.style.display = 'none';
            } else {
                el.style.display = 'block';
            }
        });
        previewImage.style.display = 'block';
        previewImage.src = URL.createObjectURL(file);
    }
};

export const revertChangeAvatarModalAction = (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
    e.stopPropagation();

    const form = document.querySelector('.form-upload-avatar');

    Array.from(form.children).forEach((el, ind) => {
        if (ind !== form.children.length - 1) {
            el.style.display = 'flex';
        } else {
            el.style.display = 'none';
        }
    });
    form.reset();
};
