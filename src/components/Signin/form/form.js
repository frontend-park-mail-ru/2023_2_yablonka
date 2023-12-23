import Component from '../../core/basicComponent';
import FormInput from '../../Common/formInput/formInput.js';
import Link from '../../atomic/link/link.js';
import template from './form.hbs';
/**
 * слои-обертки
 * @class
 */
export default class Form extends Component {
    #innerConfig = {
        forgottenPasswordLink: {
            class: 'forgotten-password',
            href: '/remember-password',
            action: 'to-remember-password',
            text: 'Забыли пароль?',
            disabled: true,
        },
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
     * Рендерит компонент
     */
    render() {
        const inputs = this.#renderForm({
            email: this.#innerConfig.email,
            password: this.#innerConfig.password,
        });
        const forgottenPasswordLink = new Link(
            null,
            this.#innerConfig.forgottenPasswordLink,
        ).render();

        return template({ inputs, forgottenPasswordLink });
    }

    /**
     * Функция для обработки события изменения пароля пользователя
     * @param {inputsData} inputsData - данные input для рендера поля формы
     * @return {inputs} inputs - массив с отрендеренными компонентами input полей формы
     */
    #renderForm(inputsData) {
        const inputs = [];
        Object.entries(inputsData).forEach(([_, input]) => {
            inputs.push(new FormInput(null, input).render());
        });
        return inputs;
    }
}
