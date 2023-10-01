export class SignHref {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get items() {
        return  { url:this.#config.url, text: this.#config.text };
    }

    render() {
        const template = Handlebars.templates["signHref.hbs"];
        this.#parent.innerHTML += template(this.items);
    }
}
