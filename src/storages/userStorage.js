import BaseStorage from './baseStorage.js';
import AJAX from '../modules/ajax.js';
import { apiPath, apiVersion } from '../configs/configs.js';
import emitter from '../modules/actionTrigger.js';
import NotificationMessage from '../components/Common/notification/notificationMessage.js';

/**
 * Хранилище объекта "пользователь"
 * @class
 */
class UserStorage extends BaseStorage {
    userModel = {
        name: 'name',
        body: 'body',
        status: 'status',
        csrf: 'csrf',
        questions: 'questions'
    };

    /**
     * @constructor
     */
    constructor() {
        super();
        this.storage.set(this.userModel.name, undefined);
        this.storage.set(this.userModel.body, undefined);
    }

    /**
     * Проверка, залогинен ли пользователь
     */
    authVerify() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${apiPath + apiVersion}auth/verify`, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('accept', 'application/json');
        xhr.withCredentials = true;
        xhr.onload = () => {
            this.storage.set(this.userModel.status, xhr.status);
            this.storage.set(this.userModel.csrf, xhr.getResponseHeader('X-Csrf-Token'));
            this.storage.set(this.userModel.body, JSON.parse(xhr.response));
            this.storage.set(this.userModel.name, 'auth');
        };

        try {
            xhr.send();
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Запрос на логин
     * @param {Object} user - Данные пользователя
     */
    async signin(user) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}auth/login/`,
            'POST',
            this.storage.get(this.userModel.csrf),
            user,
        );
        let body = {};

        try {
            body = await responsePromise.json();
        } catch (error) {
            body = {};
        }

        const { status } = responsePromise;
        if (status === 200) {
            this.changed = true;
            this.storage.set(this.userModel.name, 'auth');
            this.storage.set(this.userModel.csrf, responsePromise.headers.get('X-Csrf-Token'));
        }
        this.storage.set(this.userModel.body, body);
        this.storage.set(this.userModel.status, status);
        emitter.trigger('signin');
    }

    /**
     * Запрос на регистрацию
     * @param {Object} user - Данные пользователя
     */
    async signup(user) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}auth/signup/`,
            'POST',
            this.storage.get(this.userModel.csrf),
            user,
        );

        let body = {};

        try {
            body = await responsePromise.json();
        } catch (error) {
            body = {};
        }

        const { status } = responsePromise;

        if (status === 200) {
            this.changed = true;
            this.storage.set(this.userModel.name, 'auth');
            this.storage.set(this.userModel.csrf, responsePromise.headers.get('X-Csrf-Token'));
        }

        this.storage.set(this.userModel.body, body);
        this.storage.set(this.userModel.status, status);
        emitter.trigger('signup');
    }

    /**
     * Запрос на выход из аккаунта
     */
    async logout() {
        await AJAX(
            `${apiPath + apiVersion}auth/logout/`,
            'DELETE',
            this.storage.get(this.userModel.csrf),
            {},
        );
        emitter.trigger('logout');
    }

    /**
     * Запрос на смену имени/фамилии/описания
     * @param {Object} user - Данные пользователя
     */
    async updateProfile(user) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}user/edit/`,
            'POST',
            this.storage.get(this.userModel.csrf),
            user,
        );

        const { status } = responsePromise;
        if (status === 200) {
            this.changed = true;
            const oldUser = this.storage.get(this.userModel.body);
            oldUser.body.user.name = user.name;
            oldUser.body.user.surname = user.surname;
            oldUser.body.user.description = user.description;
            this.storage.set(this.userModel.body, oldUser);
            emitter.trigger('rerender');
            emitter.trigger('changeSuccess');

            NotificationMessage.showNotification(
                document.querySelector('input[data-name="email"]').parentNode,
                false,
                false,
                {
                    fontSize: 14,
                    fontWeight: 200,
                    text: 'Данные профиля успешно изменены',
                },
            );
        } else {
            emitter.trigger('changeError');

            NotificationMessage.showNotification(
                document.querySelector('input[data-name="email"]').parentNode,
                false,
                true,
                {
                    fontSize: 14,
                    fontWeight: 200,
                    text: 'Не удалось изменить данные профиля',
                },
            );
        }
    }

    /**
     * Запрос на смену пароля
     * @param {Object} user - Данные пользователя
     */
    async updatePassword(user) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}user/edit/change_password/`,
            'POST',
            this.storage.get(this.userModel.csrf),
            user,
        );

        const { status } = responsePromise;

        if (status === 200) {
            emitter.trigger('rerender');
            emitter.trigger('changeSuccess');

            NotificationMessage.showNotification(
                document.querySelector('input[data-name="old-password"]').parentNode,
                false,
                false,
                {
                    fontSize: 14,
                    fontWeight: 200,
                    text: 'Пароль успешно изменён',
                },
            );
        } else {
            emitter.trigger('changeError');

            NotificationMessage.showNotification(
                document.querySelector('input[data-name="old-password"]').parentNode,
                false,
                true,
                {
                    fontSize: 14,
                    fontWeight: 200,
                    text: 'Не удалось изменить пароль',
                },
            );
        }
    }

    /**
     * Запрос на смену аватара
     * @param {Object} user - Данные пользователя
     */
    async updateAvatar(user) {
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}user/edit/change_avatar/`,
            'POST',
            this.storage.get(this.userModel.csrf),
            user,
        );

        let body = {};

        try {
            body = await responsePromise.json();
        } catch (error) {
            body = {};
        }

        const { status } = responsePromise;
        if (status === 200) {
            const oldUser = this.storage.get(this.userModel.body);
            oldUser.body.user.avatar_url = body.avatar_url;
            this.storage.set(this.userModel.body, oldUser);
            emitter.trigger('rerender');
            emitter.trigger('changeSuccess');
        } else {
            emitter.trigger('changeError');
        }
    }

    /**
 * Запрос на ответ на вопрос
 * @param {Object} answer - Ответ на вопрос
 */
    async answerQuestion(answer) {
        //answer endpoint
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}user/edit/change_avatar/`,
            'POST',
            this.storage.get(this.userModel.csrf),
            answer,
        );

        // const { status } = responsePromise;
        // if (status !== 200) {

        // } 
    }

    /**
* Обновить список вопросов
* @param {Object} questions - СПисок вопросов
*/
    async updateQuestios(questions) {
        //answer endpoint
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}user/edit/change_avatar/`,
            'POST',
            this.storage.get(this.userModel.csrf),
            questions,
        );

        const { status } = responsePromise;
        if (status !== 200) {
            emitter.trigger('rerender');
        } else { }
    }

    /**
* Запрос на получение опросника
*/
    async getQuestions() {
        //get questions endpoint
        const responsePromise = await AJAX(
            `${apiPath + apiVersion}csat/question`,
            'GET',
            this.storage.get(this.userModel.csrf),
        );

        const { status } = responsePromise;
        if (status === 200) {
            this.storage.set(this.userModel.questions, responsePromise.body.questions);
        }
    }

    /**
     * Рендер страницы регистрации
     */
    getSignupPage = async () => {
        emitter.trigger('renderSignup');
    };

    /**
     * Рендер страницы логина
     */
    getSigninPage = async () => {
        emitter.trigger('renderSignin');
    };
}

const userStorage = new UserStorage();

export default userStorage;
