export class Image {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get items() {
        return Object.entries(this.#config).map(([key, { side, picture }]) => ({
            key,
            side,
            picture,
        }));
    }

    render() {
        const template = Handlebars.templates["backgroundImage.hbs"];
        const items = this.items;
        this.#parent.innerHTML += items.reduce((pictures, picture) => pictures + template(picture), "");

    }
}
