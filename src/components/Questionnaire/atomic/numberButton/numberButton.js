import Component from '../../../core/basicComponent';
import template from './numberButton.hbs';
/**
 * слои-обертки
 * @class
 */
export default class NumberButton extends Component {
    /**
     * Рендерит компонент
     */
    render() {
        return template({ rating: this.config.rating });
    }
}
