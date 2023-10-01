import { Component } from "../../core/componentClass/component.js";

export class Input extends Component {
    constructor(parent, config) {
        super(parent, config, "formInput");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
