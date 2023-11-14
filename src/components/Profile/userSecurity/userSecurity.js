import Component from '../../core/basicComponent';
import FormInput from '../../Common/formInput/formInput.js';
import Button from '../../atomic/button/button.js';
import template from './userSecurity.hbs';
/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class UserSecurity extends Component {
    constructor(parent, config) {
        super(parent, config);
    }

    #innerConfig = {
        oldPassword: {
            image: false,
            type: 'password',
            placeholder: 'Старый пароль',
            dataName: 'old-password',
            class: 'profile',
            disable: false,
        },
        newPassword: {
            image: false,
            type: 'password',
            placeholder: 'Новый пароль',
            dataName: 'new-password',
            class: 'profile',
            disable: false,
        },
        repeatNewPassword: {
            image: false,
            type: 'password',
            placeholder: 'Повторите новый пароль',
            dataName: 'repeat-new-password',
            class: 'profile',
            disable: false,
        },
        btn: {
            type: 'submit',
            action: 'update-password',
            class: 'profile-save',
            formId: 'profile',
            text: 'Сменить пароль',
        },
    };

    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            inputs: this.#renderForm(this.#innerConfig),
            btn: new Button(null, this.#innerConfig.btn).render(),
        });
    }

    #renderForm(inputsData) {
        const inputs = [];
        Object.entries(inputsData).forEach(([_, input]) => {
            inputs.push(new FormInput(null, input).render());
        });
        return inputs;
    }
}
