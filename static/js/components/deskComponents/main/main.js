import { Component } from "../../core/componentClass/component.js";

export class Main extends Component {
    constructor(parent, config) {
        super(parent, config, "main");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
