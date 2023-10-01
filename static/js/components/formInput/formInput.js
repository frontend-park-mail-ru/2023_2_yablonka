export class Input {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get items() {
        return Object.entries(this.#config).map(([key, { icon, type, placeholder }]) => ({
            key,
            icon,
            type,
            placeholder
        }));
    }

    render() {
        const template = Handlebars.templates["formInput.hbs"];
        const items = this.items;
        this.#parent.innerHTML += items.reduce((inputs, input) => inputs + template(input), "");
    }
}
