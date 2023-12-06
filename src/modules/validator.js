import { validateObjectNameRegExp, validatePasswordRegExp } from './regExp.js';

/**
 * Класс для валидации данных формы
 * @class
 */
export default class Validator {
    /**
     * Проверяет email на правильность
     *
     * @param {string} email - Строка с email
     * @return {boolean} - false, если неправильный, true, если правильный
     */
    static validateEmail = (email) => (email.trim().match(/@/g) || []).length === 1;

    /**
     * Проверяет пароль на правильность
     *
     * @param {string} password - Строка с паролем
     * @return {boolean} - false, если неправильный, true, если правильный
     */
    static validatePassword = (password) => validatePasswordRegExp.test(password);

    /**
     * Проверяет пароли на совпадение
     *
     * @param {string} passwordOne - Строка с паролем
     * @param {string} passwordTwo - Строка с повторённым паролем
     * @return {boolean} - false, если неправильный, true, если правильный
     */
    static validateRepeatPasswords = (passwordOne, passwordTwo) => passwordOne === passwordTwo;

    /**
     * Проверяет пароли на совпадение
     *
     * @param {string} passwordOne - Строка с паролем
     * @param {string} passwordTwo - Строка с повторённым паролем
     * @return {boolean} - false, если неправильный, true, если правильный
     */
    static validateObjectName = (name) => validateObjectNameRegExp.test(name);
}
