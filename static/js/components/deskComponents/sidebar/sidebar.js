import { Component } from "../../core/componentClass/component.js";

export class Sidebar extends Component {
    constructor(parent, config) {
        super(parent, config, "sidebar");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
