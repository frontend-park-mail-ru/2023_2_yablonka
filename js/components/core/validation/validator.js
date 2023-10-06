
/**
 * Класс для валидации данных формы
 * @class
 */
export class Validator {
    /**
     * Проверяет email на правильность
     *
     * @param {string} email - Строка с email
     * @return {boolean} - false если неправильный, true, если правильный
     */

    static validateEmail = (email) => {
        let re = new RegExp(/^[A-Za-z0-9_.-]+@[A-Za-z0-9.-]+$/g);
        return re.test(email);
    };

    /**
     * Проверяет пароль на правильность
     *
     * @param {string} password - Строка с паролем
     * @return {boolean} - false если неправильный, true, если правильный
     */

    static validatePassword = (password) => {
        let re = new RegExp(/^\w{8,}$/);
        return re.test(password);
    };

    /**
     * Проверяет пароли на совпадение
     *
     * @param {string} passwordOne - Строка с паролем
     * @param {string} passwordTwo - Строка с повторённым паролем
     * @return {boolean} - false если неправильный, true, если правильный
     */

    static validateRepeatPasswords = (passwordOne, passwordTwo) => {
        return passwordOne === passwordTwo;
    };
}
