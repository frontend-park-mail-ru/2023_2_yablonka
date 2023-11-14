import Component from '../../core/basicComponent';
import FormInput from '../../Common/formInput/formInput.js';
import template from './form.hbs';
/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class Form extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    #innerConfig = {
        email: {
            image: true,
            src: 'person',
            type: 'text',
            placeholder: 'Email',
            dataName: 'email',
            class: 'sign',
            disable: false,
        },
        password: {
            image: true,
            src: 'lock',
            type: 'password',
            placeholder: 'Пароль',
            dataName: 'password',
            class: 'sign',
            disable: false,
        },
    };

    /**
     * Рендерит компонент в DOM
     */
    render() {
        const inputs = this.#renderForm(this.#innerConfig);
        return template({ inputs });
    }

    #renderForm(inputsData) {
        const inputs = [];
        Object.entries(inputsData).forEach(([_, input]) => {
            inputs.push(new FormInput(null, input).render());
        });
        return inputs;
    }
}
