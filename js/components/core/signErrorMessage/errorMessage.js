/**
 * Отображает ошибку над определенным input
 *
 * @param {string} inputType - Тип input
 * @param {string} message - Текст ошибки
 */

export const errorMessage = (inputType, message) => {
    const input = document.querySelector(`input[input-type="${inputType}"]`);
    let err = input.parentElement.childNodes[0];
    err.textContent = message;
    setTimeout(() => {
        err.style.opacity = "0";
        err.style.opacity = "1";
    }, 1);

    setTimeout(() => {
        err.style.opacity = "0";
        err.style.opacity = "1";
    }, 500);

    setTimeout(() => {
        err.style.opacity = "1";
        err.style.opacity = "0";
        err.textContent = "";
    }, 5000);
};
