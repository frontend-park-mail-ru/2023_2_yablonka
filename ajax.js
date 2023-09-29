"use strict";

/**
 * Делает ajax-запрос на сервер
 * @param {string} url - URL, куда делаем запрос.
 * @param {Object} payload - данные, которые мы отсылаем
 * @param {string} method - метод запроса
 * @param {Function} callback - функция для обработки результата запроса
 * @returns {undefined}
 */

const ajax = async (url, payload = {}, method = "GET") => {
  return await fetch(url, {
    headers: {
      //"X-CSRFToken": csrftoken, - это нужно будет позже
      "Content-Type": "application/json;charset=utf8",
    },
    credentials: "include",
    method: method,
    body: JSON.stringify(payload),
  });
};
