import { Component } from "../../core/componentClass/component.js";

export class SignFormContainer extends Component {
    constructor(parent, config) {
        super(parent, config, "sign-form__container");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
