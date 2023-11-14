import FormInput from '../../Common/formInput/formInput';
import Button from '../../atomic/button/button';
import Textarea from '../../atomic/textarea/textarea';
import Component from '../../core/basicComponent';
import template from './userInformation.hbs';
/**
 * слои-обертки
 * @class
 * @param {HTMLElement} parent - Родительский элемент, в который будет вставлен компонент.
 * @param {Object} config - Объект с конфигурацией компонента.
 */
export default class UserInformation extends Component {
    #innerConfig = {
        email: {
            image: false,
            type: 'email',
            placeholder: 'Email',
            dataName: 'email',
            class: 'profile',
            disable: true,
        },
        name: {
            image: false,
            type: 'text',
            placeholder: 'Имя',
            dataName: 'name',
            class: 'profile',
            disable: false,
        },
        surname: {
            image: false,
            type: 'text',
            placeholder: 'Фамилия',
            dataName: 'surname',
            class: 'profile',
            disable: false,
        },
        description: {
            maxlength: 256,
            dataName: 'user-description',
            placeholder: 'О себе...',
            class: 'profile',
        },
        btn: {
            type: 'submit',
            action: 'update-profile',
            class: 'profile-save',
            formId: 'profile',
            text: 'Сохранить',
        },
    };

    /**
     * Рендерит компонент в DOM
     */
    render() {
        return template({
            inputs: this.#renderForm({
                email: { ...this.#innerConfig.email, value: this.config.email },
                name: { ...this.#innerConfig.name, value: this.config.name },
                surname: { ...this.#innerConfig.surname, value: this.config.surname },
            }),
            textarea: new Textarea(null, {
                ...this.#innerConfig.description,
                value: this.config.description,
            }).render(),
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
