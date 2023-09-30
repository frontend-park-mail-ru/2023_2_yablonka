export class Image {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    get items() {
        return Object.entries(this.config).map(({ side, picture }) => ({
            side,
            picture,
        }));
    }

    render() {
        const template = Handlebars.templates["BackgroundImage.hbs"];

        const items = this.items.map((element, index) => {
            let className = "page__image";
            className += ` page__image_${element.picture}.svg`;
            return { ...element, className };
        });

        this.#parent.innerHTML = template({ items });
    }
}
