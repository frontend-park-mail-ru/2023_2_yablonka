/**
 * Делает ajax-запрос на сервер
 * @param {string} url - URL, куда делаем запрос.
 * @param {Object} payload - данные, которые мы отсылаем
 * @param {string} method - метод запроса
 * @param {Function} callback - функция обратного вызова
 * @returns {undefined}
 */

export const AJAX = async (url, method = "GET", payload = {}) => {
    const request = new Request({
        headers: {
            "Content-Type": "application/json;charset=utf8",
            "Origin": "http://localhost:8081/",
        },
        credentials: "include",
        method: method,
    });

    if (method.toLowerCase() != "get" && method.toLowerCase() != "head")
        request.payload = payload;

    return await fetch(url);
};
