import Component from '../core/basicComponent';
import NumberButton from './atomic/numberButton/numberButton';
import StarButton from './atomic/starButton/starButton';
import template from './questionnaire.hbs';
/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Questionnaire extends Component {
    #innerConfig = {
        NSP: 5,
        CSP: 10,
    };

    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            title: this.config.content,
            rating: this.#innerConfig[this.config.metric],
            buttons: this.#getButtons(this.metric),
        });
    }

    #getButtons(metric) {
        const Btn = metric === 'NSP' ? StarButton : NumberButton;
        const btns = [];
        for (let i = 0; i < this.#innerConfig[metric]; i += 1) {
            btns.push(new Btn({ rating: this.#innerConfig[metric] }.render()));
        }
        return btns;
    }
}
