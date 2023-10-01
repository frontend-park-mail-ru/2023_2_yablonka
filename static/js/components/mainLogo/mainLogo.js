export class MainLogo {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get items() {
        return { logo: this.#config.logo, title: this.#config.title };
    }

    render() {
        const template = Handlebars.templates["mainLogo.hbs"];
        this.#parent.innerHTML += template(this.items);
    }
}
