import { Component } from "../../core/componentClass/component.js";

export class GuestWorkspace extends Component {
    constructor(parent, config) {
        super(parent, config, "guestWorkspace");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
