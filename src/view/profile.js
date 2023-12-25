// base view
import BaseView from './baseView.js';
// components
import ProfilePage from '../pages/Profile/profile.js';
import ChangeAvatarPopup from '../components/popups/changeAvatar/changeAvatar.js';
import CreateWorkspace from '../components/popups/createWorkspace/createWorkspace.js';
import UploadAvatarModal from '../components/popups/uploadAvatar/uploadAvatar.js';
// storages
import userStorage from '../storages/userStorage.js';
import Navigation from '../components/popups/navigation/navigation.js';
import emitter from '../modules/actionTrigger.js';

/**
 * Класс для рендера страницы профиля
 * @class
 * @param {HTMLElement} root - Родительский элемент, в который будет вставлена страница.
 */
class Profile extends BaseView {
    constructor() {
        super();
        emitter.bind('updateProfile', this.reRender.bind(this));
    }

    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        document.title = 'Tabula: Profile';

        const { user } = userStorage.storage.get(userStorage.userModel.body).body;

        if (window.location.pathname === '/profile') {
            this.components.push(new ProfilePage(this.root, { ...user, information: true }));
        } else if (window.location.pathname === '/security') {
            this.components.push(new ProfilePage(this.root, { ...user, information: false }));
        }
        this.components.push(
            ...[
                new Navigation(this.root, user),
                new CreateWorkspace(this.root, {}),
                new ChangeAvatarPopup(this.root, {}),
                new UploadAvatarModal(this.root, {}),
            ],
        );

        this.render();
        this.addListeners();
    }

    /**
     * Ререндер страницы
     */
    async reRender() {
        this.clear();
        this.renderPage();
    }
}

const profile = new Profile();

export default profile;
