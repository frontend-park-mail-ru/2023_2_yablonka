import Component from '../../../core/basicComponent.js';
import template from './file.hbs';
import './file.scss';

/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class File extends Component {
    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            url: this.config.file_path,
            filename: this.config.original_name,
            creationDate: this.#processDateToLocale(this.config.date_created),
            fileExtension: this.config.file_path.match(/\.\w+$/)[0],
            file: this.config.file_path.match(/\w+\.\w+$/)[0],
        });
    }

    #processDateToLocale = (creationDate) => {
        const date = new Date(creationDate);
        return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} в ${date.getHours()}:${
            (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        }`;
    };
}
