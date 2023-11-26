import Component from '../../core/basicComponent.js';
import template from './notificationMessage.hbs';
import './notificationMessage.scss';

/**
 * Ошибка при неправильном логине/пароле и тп
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class NotificationMessage extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template(this.config);
    }

    static showNotification(referenceElement, hidePrevElem, isError, message) {
        const notification = document.createElement('div');
        notification.className = `flex-start font-size-${message.fontSize} font-weight-${message.fontWeight} notification-wrapper`;
        notification.dataset.element = referenceElement.className;

        const parentElement = referenceElement.parentNode;

        notification.innerHTML = new NotificationMessage(null, { ...message, isError }).render();
        notification.setAttribute(
            'style',
            `width: ${referenceElement.getBoundingClientRect().width}px;`,
        );

        try {
            document.querySelector(`div[data-element="${referenceElement.className}"]`)?.remove();
        } finally {
            if (hidePrevElem) {
                const hiddenElement = referenceElement.previousElementSibling;
                const elDisplay = hiddenElement.style.display;

                hiddenElement.style.display = 'none';
                parentElement.insertBefore(notification, referenceElement);

                setTimeout(() => {
                    hiddenElement.style.display = elDisplay;
                    document
                        .querySelector(`div[data-element="${referenceElement.className}"]`)
                        .remove();
                }, 5000);
            } else {
                parentElement.insertBefore(notification, referenceElement);

                setTimeout(() => {
                    document
                        .querySelector(`div[data-element="${referenceElement.className}"]`)
                        ?.remove();
                }, 5000);
            }
        }
    }
}
