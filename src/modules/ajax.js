/**
 * Делает ajax-запрос на сервер
 * @param {string} url - URL, куда делаем запрос.
 * @param {string} method - метод запроса
 * @param {Object} payload - данные, которые мы отсылаем
 * @returns {Promise} - результат fetch
 */
export default async function AJAX(url, requestMethod, csrf, requestPayload = {}) {
    let request;
    if (requestMethod.toLowerCase() !== 'get' && requestMethod.toLowerCase() !== 'head') {
        request = new Request(url, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRF-Token': csrf,
            },
            credentials: 'include',
            body: JSON.stringify(requestPayload),
            method: requestMethod,
        });
    } else {
        request = new Request(url, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRF-Token': csrf,
            },
            credentials: 'include',
            method: requestMethod,
        });
    }

    return fetch(request);
}
