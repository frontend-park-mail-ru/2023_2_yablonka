export class Component {

    constructor(parent, config, templateName) {
        this.parent = parent;
        this.config = config;
        this.template = Handlebars.templates[`${templateName}.hbs`];
    }

    get data() {
        return Object.entries(this.config).map(([key, configs]) => ({
            key,
            ...configs,
        }));
    }

    // render() {

    //     this.#parent.innerHTML += this.data.reduce((inputs, input) => inputs + this.#template(input), "");
    // }
}
