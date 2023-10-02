import { Component } from "../../core/componentClass/component.js";

export class Content extends Component {
    constructor(parent, config) {
        super(parent, config, "content");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
