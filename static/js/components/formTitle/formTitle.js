export class FormTitle {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get items() {
        return { title: this.#config.title };
    }

    render() {
        const template = Handlebars.templates["formTitle.hbs"];
        this.#parent.innerHTML += template(this.items);
    }
}
