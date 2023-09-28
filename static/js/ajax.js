"use strict";

/**
 * Делает ajax-запрос на сервер
 * @param {string} url - URL, куда делаем запрос.
 * @param {Object} payload - данные, которые мы отсылаем
 * @param {string} method - метод запроса
 * @param {Function} callback - функция для обработки результата запроса
 * @returns {undefined}
 */

const ajax = async (url, payload, method, callback) => {
  const request = new Request(url, {
    headers: {
      //"X-CSRFToken": csrftoken, - это нужно будет позже
      "Content-Type": "application/json;charset=utf8",
    },
    credentials: "include",
    method: method,
    body: JSON.stringify(payload),
  });

  const result = await fetch(request)
    .then((res) => JSON.parse(res))
    .catch((err) => new Object({ "status-code": 500 }));

  callback(result);
};
