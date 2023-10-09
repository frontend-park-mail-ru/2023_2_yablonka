import AJAX from '../ajax/ajax.js';

/**
 * Делает ajax-запрос на сервер
 * @returns {Promise} - результат проверки, залогинен ли юзер. Если да, то его данные
 */

export default async function loginCheck() {
    return AJAX('http://localhost:8080/api/v1/auth/verify/', 'GET')
        .then((res) => res.json())
        .catch(() => null);
}
