export class FormComponent {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    render() {
        const template = Handlebars.templates["formComponent.hbs"];
        const items = this.items;
        this.#parent.innerHTML += template();
    }
}
