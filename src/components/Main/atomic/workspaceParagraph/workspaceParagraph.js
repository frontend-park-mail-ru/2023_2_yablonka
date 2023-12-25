import Component from '../../../core/basicComponent.js';
import template from './workspaceParagraph.hbs';
/**
 * Класс компонента списка рабочих пространств
 * @class
 */
export default class ContainerMain extends Component {
    /**
     * Рендерит
     */
    render() {
        return template(this.config);
    }
}
