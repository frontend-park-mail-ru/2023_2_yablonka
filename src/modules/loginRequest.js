import AJAX from './ajax.js';

/**
 * Делает ajax-запрос на сервер
 * @returns {Promise} - результат проверки, залогинен ли юзер. Если да, то его данные
 */
export default async function loginRequest() {
    return AJAX('http://localhost:8080/api/v1/auth/verify/', 'GET')
        .then((res) => res.json())
        .catch(() => null);
}
