import Component from '../../core/basicComponent';
import FormInput from '../../Common/formInput/formInput.js';
import Button from '../../atomic/button/button.js';
import template from './userSecurity.hbs';
/**
 * Класс с компонентом для смены пароля
 * @class
 */
export default class UserSecurity extends Component {
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

    /**
     * Функция для получения отредеренного массива c компонентами формы
     * @param {array} inputsData - данные input для рендера компонента формы
     * @return {array} inputs - массив с отрендеренными компонентами формы
     */
    #renderForm(inputsData) {
        const inputs = [];
        Object.entries(inputsData).forEach(([_, input]) => {
            inputs.push(new FormInput(null, input).render());
        });
        return inputs;
    }
}
