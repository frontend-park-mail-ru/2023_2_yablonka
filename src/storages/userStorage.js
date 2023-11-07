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
        xhr.send();
    }

    /**
     * Запрос на логин
     * @param {Object} user - Данные пользователя
     */
    async signin(user) {
        const responsePromise = await AJAX(`${apiPath + apiVersion}auth/login/`, 'POST', user);

        const body = await responsePromise.json();
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

        const body = await responsePromise.json();
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
        const responsePromise = await AJAX(`${apiPath + apiVersion}auth/login/`, 'POST', user);

        const body = await responsePromise.json();
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
