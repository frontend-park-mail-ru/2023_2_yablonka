/**
 * Класс, который реагирует на передаваемые события
 * @class
 */
class ActionTrigger {
    #events;

    /**
     * @constructor
     */
    constructor() {
        this.#events = {};
    }

    /**
     * Выполняет bind функции на определенное событие
     * @param {string} event - название события
     * @param {Function} callback - функция, которая вызывается при передаче события
     */
    bind(event, callback) {
        this.#events = this.#events || {};
        this.#events[event] = this.#events[event] || [];

        this.#events[event].push(callback);
    }

    /**
     * Выполняет unbind функции на определенное событие
     * @param {string} event - название события
     * @param {Function} callback - функция, которая вызывается при передаче события
     */
    unbind(event, callback) {
        this.#events = this.#events || {};
        if (!(event in this.#events)) {
            return;
        }
        const idx = this.#events[event].indexOf(callback);
        if (idx !== -1) {
            this.#events[event].splice(this.#events[event].indexOf(callback), 1);
        }
    }

    /**
     * Вызывает событие
     * @param {string} event - название события
     */
    trigger(event) {
        this.#events = this.#events || {};
        if (!(event in this.#events)) {
            return;
        }

        this.#events[event].forEach((ev) => {
            ev.apply(this, Array.prototype.slice.call(event, 1));
        });
    }
}

const emitter = new ActionTrigger();

export default emitter;
