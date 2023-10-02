import { Component } from "../../core/componentClass/component.js";

export class BoardsList extends Component {
    constructor(parent, config) {
        super(parent, config, "boardsList");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
