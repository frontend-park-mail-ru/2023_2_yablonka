import { Component } from "../../core/componentClass/component.js";

export class HeaderMenu extends Component {
    constructor(parent, config) {
        super(parent, config, "headerMenu");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
