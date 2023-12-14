import Component from '../../../core/basicComponent';
import template from './board.hbs';
/**
 * Класс компонента доски
 * @class
 */
export default class Board extends Component {
    /**
     * Рендерит компонент
     */
    render() {
        return template(this.config);
    }
}
