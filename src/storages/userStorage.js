import BaseStorage from './baseStorage.js';
import AJAX from '../modules/ajax.js';
import { apiPath, apiVersion } from '../configs/configs.js';
import emitter from '../modules/eventEmitter.js';

class UserStorage extends BaseStorage {
    userModel = {
        name: 'name',
        body: 'body',
        status: 'status',
    };

    constructor() {
        super();
        this.storage.set(this.userModel.name, undefined);
        this.storage.set(this.userModel.body, undefined);
    }

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

    async logout() {
        await AJAX(`${apiPath + apiVersion}auth/logout/`, 'DELETE', {});
        emitter.trigger('logout');
    }

    getSignupPage = async () => {
        emitter.trigger('renderSignup');
    };

    getSigninPage = async () => {
        emitter.trigger('renderSignin');
    };
}

const userStorage = new UserStorage();

export default userStorage;
