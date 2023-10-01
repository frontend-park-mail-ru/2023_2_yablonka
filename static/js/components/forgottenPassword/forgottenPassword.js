export class ForgottenPassword {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get items() {
        return { text: this.#config.text };
    }

    render() {
        const template = Handlebars.templates["forgottenPassword.hbs"];
        this.#parent.innerHTML += template(this.items);
    }
}
