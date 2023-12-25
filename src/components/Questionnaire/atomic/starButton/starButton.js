import Component from '../../../core/basicComponent';
import template from './starButton.hbs';
/**
 * слои-обертки
 * @class
 */
export default class StarButton extends Component {
    /**
     * Рендерит компонент
     */
    render() {
        return template({ rating: this.config.rating });
    }
}
