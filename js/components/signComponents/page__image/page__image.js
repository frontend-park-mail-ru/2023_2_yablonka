import Component from '../../core/componentClass/component.js';

/**
 * Изображение на фоне страницы логина/регистрации
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */

export default class PageImage extends Component {
    constructor(parent, config) {
        super(parent, config, 'page__image');
    }

    /**
     * Рендерит компонент в DOM
     */

    render() {
        this.parent.innerHTML += this.data.reduce(
            (pictures, picture) => pictures + this.template(picture),
            '',
        );
    }
}
