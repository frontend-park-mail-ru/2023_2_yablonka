import { Component } from "../../core/componentClass/component.js";

export class Desk extends Component {
    constructor(parent, config) {
        super(parent, config, "desk");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
