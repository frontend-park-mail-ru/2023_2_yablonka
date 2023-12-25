import Component from '../../core/basicComponent';
import NumberButton from '../atomic/numberButton/numberButton';
import StarButton from '../atomic/starButton/starButton';
import template from './questionnaireContent.hbs';
import './questionnaireContent.scss';
/**
 * слои-обертки
 * @class
 */
export default class QuestionnaireContent extends Component {
    #innerConfig = {
        NSP: 5,
        CSI: 10,
    };

    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            title: this.config.content,
            metric: this.config.type,
            buttons: this.#getButtons(this.config.type),
        });
    }

    /**
     * Функция для получения отредеренного массива c кнопками рейтинга
     * @param {string} metric - тип метрики
     * @return {array} btns - массив с отрендеренными компонентами кнопок
     */
    #getButtons(metric) {
        const btns = [];
        for (let i = 1; i < this.#innerConfig[metric] + 1; i += 1) {
            btns.push(
                metric === 'NSP'
                    ? new StarButton(null, { rating: i }).render()
                    : new NumberButton(null, { rating: i }).render(),
            );
        }
        return btns;
    }
}
