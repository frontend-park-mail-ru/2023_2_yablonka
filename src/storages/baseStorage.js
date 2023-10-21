/**
 * Базовый класс хранилища
 * @class
 */
export default class BaseStorage {
    changed;

    storage;

    /**
     * @constructor
     */
    constructor() {
        this.changed = false;
        this.storage = new Map();
    }

    /**
     * Метод, возвращающий текущее состояние хранилища.
     * @param field - возвращаемое поле
     * @returns контекст хранилища
     */
    getState(field) {
        return field ? this.storage.get(field) : this.storage;
    }

    /**
     * Метод, проверяющий, изменилось ли хранилище
     * @returns результат проверки
     */
    onChange() {
        return this.changed;
    }
}
