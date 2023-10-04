/**
 * Делает ajax-запрос на сервер
 * @param {string} url - URL, куда делаем запрос.
 * @param {Object} payload - данные, которые мы отсылаем
 * @param {string} method - метод запроса
 * @param {Function} callback - функция обратного вызова
 * @returns {undefined}
 */

export const AJAX = async (url, requestMethod, requestPayload = {}) => {
    let request;
    if (
        requestMethod.toLowerCase() != "get" &&
        requestMethod.toLowerCase() != "head"
    ) {
        request = new Request(url, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            credentials: "include",
            body: JSON.stringify(requestPayload),
            method: requestMethod,
        });
    } else {
        request = new Request(url, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            credentials: "include",
            method: requestMethod,
        });
    }
    console.log(request);

    return await fetch(request);
};
