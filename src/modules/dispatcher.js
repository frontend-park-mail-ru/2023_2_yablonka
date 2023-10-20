import handlers from '../configs/handlers.js';

class Dispatcher {
    constructor() {
        this.state = {};
        this.mapActionHandlers = new Map();

        handlers.forEach((handler) => {
            this.register(handler);
        });
    }

    register({ type, method }) {
        this.mapActionHandlers.set(type, method);
    }

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
