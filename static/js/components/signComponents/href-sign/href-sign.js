import { Component } from "../../core/componentClass/component.js";

export class HrefSign extends Component {
    constructor(parent, config) {
        super(parent, config, "href-sign");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (hrefs, href) => hrefs + this.template(href),
            ""
        );
    }
}
