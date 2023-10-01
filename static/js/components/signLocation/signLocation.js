export class Location {
    #parent;

    constructor(parent) {
        this.#parent = parent;
    }

    render() {
        const template = Handlebars.templates["signLocation.hbs"];

        this.#parent.innerHTML += template({});
    }
}
