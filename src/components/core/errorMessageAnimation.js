/**
 * Отображает ошибку над определенным input
 *
 * @param {string} errorClass - Название класса элемента ошибки
 * @param {string} errorName - Название элемента ошибки
 * @param {string} message - Текст ошибки
 */
export default function errorMessageAnimation(errorClass, errorName, message) {
    const errorElement = document.querySelector(`.error-${errorClass}[data-name="${errorName}"]`);
    const err = errorElement.firstChild;
    err.textContent = message;
    err.display = 'flex';
    setTimeout(() => {
        err.textContent = '';
        err.display = 'none';
    }, 7000);
}
