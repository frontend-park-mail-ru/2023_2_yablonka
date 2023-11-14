// base view
import BaseView from './baseView.js';
// components
import SignupPage from '../pages/Signup/signup.js';

/**
 * Класс для рендера страницы регистрации
 * @class
 */
class Signup extends BaseView {
    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        document.title = 'Tabula: Sign Up';
        this.components.push(new SignupPage(this.root, {}));

        this.render();
        this.addListeners();
    }
}

const signUp = new Signup();

export default signUp;
