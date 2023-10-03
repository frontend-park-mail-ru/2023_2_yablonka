import { Component } from "../../core/componentClass/component.js";

export class Header extends Component {
    constructor(parent, config) {
        super(parent, config, "header");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
