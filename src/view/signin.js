// base view
import BaseView from './baseView.js';
// components
import SigninPage from '../pages/Signin/signin.js';
/**
 * Класс для рендера страницы логина
 * @class
 */
class Signin extends BaseView {
    /**
     * Рендер страницы в DOM
     */
    async renderPage() {
        document.title = 'Tabula: Sign In';
        this.components.push(new SigninPage(this.root, {}));

        this.render();
        this.addListeners();
    }
}

const signin = new Signin();

export default signin;
