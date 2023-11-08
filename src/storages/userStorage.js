import BaseStorage from './baseStorage.js';
import AJAX from '../modules/ajax.js';
import { apiPath, apiVersion } from '../configs/configs.js';
import emitter from '../modules/actionTrigger.js';

/**
 * Хранилище объекта "пользователь"
 * @class
 */
class UserStorage extends BaseStorage {
    userModel = {
        name: 'name',
        body: 'body',
        status: 'status',
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
     * Проверка, залоигнен ли пользователь
     */
    authVerify() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${apiPath + apiVersion}auth/verify`, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('accept', 'application/json');
        xhr.withCredentials = true;
        xhr.onload = () => {
            this.storage.set(this.userModel.status, xhr.status);
            this.storage.set(this.userModel.body, JSON.parse(xhr.response));
            this.storage.set(this.userModel.name, 'auth');
        };

        try{
            xhr.send();
        }
        catch(err){
            console.log(err);
        }
        
    }

    /**
     * Запрос на логин
     * @param {Object} user - Данные пользователя
     */
    async signin(user) {
        const responsePromise = await AJAX(`${apiPath + apiVersion}auth/login/`, 'POST', user);

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
        const responsePromise = await AJAX(`${apiPath + apiVersion}auth/signup/`, 'POST', user);

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
        }

        this.storage.set(this.userModel.body, body);
        this.storage.set(this.userModel.status, status);
        emitter.trigger('signup');
    }

    /**
     * Запрос на выход из аккаунта
     */
    async logout() {
        await AJAX(`${apiPath + apiVersion}auth/logout/`, 'DELETE', {});
        emitter.trigger('logout');
    }

    /**
     * Запрос на смену имени/фамилии/описания
     * @param {Object} user - Данные пользователя
     */
    async updateProfile(user) {
        const responsePromise = await AJAX(`${apiPath + apiVersion}user/edit/`, 'POST', user);

        let body = {};

        try {
            body = await responsePromise.json();
        } catch (error) {
            body = {};
        }

        const { status } = responsePromise;
        if (status === 200) {
            this.changed = true;
            const oldUser = this.storage.get(this.userModel.body);
            oldUser.name = body.name;
            oldUser.surname = body.surname;
            oldUser.description = body.description;
            this.storage.set(this.userModel.body, oldUser);
            emitter.trigger('profile');
            emitter.trigger('changeSuccess');
        } else {
            emitter.trigger('changeError');
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
            emitter.trigger('changeSuccess');
        } else {
            emitter.trigger('changeError');
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
            oldUser.thumbnail_url = body.thumbnail_url;
            this.storage.set(this.userModel.body, oldUser);
            emitter.trigger('changeSuccess');
        } else {
            emitter.trigger('changeError');
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
