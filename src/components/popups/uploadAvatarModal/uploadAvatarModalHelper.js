import userStorage from '../../../storages/userStorage.js';
import { actionUpdateAvatar } from '../../../actions/userActions.js';
import dispatcher from '../../../modules/dispatcher.js';

const changeForm = (from, to) => {
    const form = document.querySelector('.form-upload-avatar');

    Array.from(form.children).forEach((el, ind) => {
        if (ind !== form.children.length - 1) {
            el.style.display = to;
        } else {
            el.style.display = from;
        }
    });
    form.reset();
};

export const uploadAvatarModal = (e) => {
    e.stopPropagation();

    changeForm('none', 'flex');

    const dialog = document.querySelector('#upload-avatar');
    const prevDialog = document.querySelector('#change-avatar');

    if (dialog.getAttribute('open') !== '') {
        prevDialog.close();
    }
};

export const chooseFileAvatarModal = (e) => {
    e.stopPropagation();

    document.querySelector('.input-upload-avatar').click();
};

export const previewAvatarModal = (e) => {
    e.stopPropagation();

    const [file] = document.querySelector('.input-upload-avatar').files;
    const previewImage = document.querySelector('.avatar-preview__image');

    if (file) {
        changeForm('flex', 'none');

        previewImage.style.display = 'block';
        previewImage.src = URL.createObjectURL(file);
    }
};

export const revertChangeAvatarModal = (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
    e.stopPropagation();

    changeForm('none', 'flex');
};

export const updateAvatarModal = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const [file] = document.querySelector('.input-upload-avatar').files;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userStorage.storage.get(userStorage.userModel.body).user_id);

    dispatcher.dispatch(actionUpdateAvatar(formData));

    changeForm('none', 'flex');
};
