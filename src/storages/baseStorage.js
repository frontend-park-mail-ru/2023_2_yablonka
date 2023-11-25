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
}
