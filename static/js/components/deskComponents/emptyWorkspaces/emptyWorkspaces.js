import { Component } from "../../core/componentClass/component.js";

export class EmptyWorkspaces extends Component {
    constructor(parent, config) {
        super(parent, config, "emptyWorkspaces");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
