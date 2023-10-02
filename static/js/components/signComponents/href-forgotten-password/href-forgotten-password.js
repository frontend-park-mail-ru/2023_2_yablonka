import { Component } from "../../core/componentClass/component.js";

export class Href_Forgotten_Password extends Component {
    constructor(parent, config) {
        super(parent, config, "href-forgotten-password");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
