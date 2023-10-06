import { AJAX } from "../ajax/ajax.js";

/**
 * Делает ajax-запрос на сервер
 * @returns {Promise} - результат проверки, залогинен ли юзер. Если да, то его данные
 */

export const loginCheck = async () => {
   return await AJAX("http://213.219.215.40:8080/api/v1/auth/verify/", "GET")
        .then((res) => res.json())
        .catch((err) => null);
};