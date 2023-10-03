import { Component } from "../../core/componentClass/component.js";

export class WorkspaceCardDesctiption extends Component {
    constructor(parent, config) {
        super(parent, config, "workspace-card__desctiption");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
