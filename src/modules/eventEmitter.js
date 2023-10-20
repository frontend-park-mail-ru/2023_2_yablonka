class EventEmitter {
    #events;

    constructor() {
        this.#events = {};
    }

    bind(event, callback) {
        this.#events = this.#events || {};
        this.#events[event] = this.#events[event] || [];

        this.#events[event].push(callback);
    }

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

    trigger(event) {
        this.#events = this.#events || {};
        if (!(event in this.#events)) {
            return;
        }
        this.#events[event].forEach((ev) => {
            ev.apply(this, Array.prototype.slice.call(arguments, 1));
        });
    }
}

const emitter = new EventEmitter();

export default emitter;
