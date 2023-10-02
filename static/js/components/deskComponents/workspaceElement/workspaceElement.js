import { Component } from "../../core/componentClass/component.js";

export class WorkspaceElement extends Component {
    constructor(parent, config) {
        super(parent, config, "workspaceElement");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
