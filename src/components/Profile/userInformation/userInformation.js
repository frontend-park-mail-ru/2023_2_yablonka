import FormInput from '../../Common/formInput/formInput';
import Button from '../../atomic/button/button';
import Textarea from '../../atomic/textarea/textarea';
import Component from '../../core/basicComponent';
import template from './userInformation.hbs';
/**
 * Класс с компонентом для смены информации пользователя
 * @class
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
     * Рендерит компонент
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
