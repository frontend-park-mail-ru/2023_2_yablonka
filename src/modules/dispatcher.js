import handlers from '../configs/handlers.js';

/**
 * Класс диспетчера
 * @class
 */
class Dispatcher {
    /**
     * @constructor
     */
    constructor() {
        this.state = {};
        this.mapActionHandlers = new Map();

        handlers.forEach((handler) => {
            this.register(handler);
        });
    }

    /**
     * Метод для регистрации handler в Dispatcher
     * @param {string} handler.type - тип, регистрируемого действия
     * @param {Function} handler.method - вызываемая действием функция
     */
    register({ type, method }) {
        this.mapActionHandlers.set(type, method);
    }

    /**
     * Реакция на передаваемое событие
     * @param {Object} action - Объект, описывающий действие
     */
    async dispatch(action) {
        const storeReducer = this.mapActionHandlers.get(action.type);
        if (!storeReducer) {
            return;
        }

        if (Object.hasOwnProperty.call(action, 'value')) {
            await storeReducer(action.value);
        } else {
            await storeReducer();
        }
    }
}

export const dispatcher = new Dispatcher();

export default dispatcher;
