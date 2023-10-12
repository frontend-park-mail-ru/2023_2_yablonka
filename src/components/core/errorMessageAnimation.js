/**
 * Отображает ошибку над определенным input
 *
 * @param {string} inputType - Тип input
 * @param {string} message - Текст ошибки
 */
export default function errorMessageAnimation(inputType, message) {
    const input = document.querySelector(`input[input-type="${inputType}"]`);
    const err = input.parentElement.childNodes[0];
    const errMessage = err.childNodes[0];
    errMessage.textContent = message;
    setTimeout(() => {
        err.style.opacity = '0';
        err.style.opacity = '1';
    }, 1);

    setTimeout(() => {
        err.style.opacity = '0';
        err.style.opacity = '1';
    }, 500);

    setTimeout(() => {
        err.style.opacity = '1';
        err.style.opacity = '0';
        errMessage.textContent = '';
    }, 5000);
}
