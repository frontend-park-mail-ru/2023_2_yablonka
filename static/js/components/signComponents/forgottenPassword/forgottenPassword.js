import { Component } from "../../core/componentClass/component.js";

export class ForgottenPassword extends Component {
    constructor(parent, config) {
        super(parent, config, "forgottenPassword");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}