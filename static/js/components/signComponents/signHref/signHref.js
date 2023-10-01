import { Component } from "../../core/componentClass/component.js";

export class SignHref extends Component {
    constructor(parent, config) {
        super(parent, config, "signHref");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (hrefs, href) => hrefs + this.template(href),
            ""
        );
    }
}
