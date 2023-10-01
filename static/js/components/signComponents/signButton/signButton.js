import { Component } from "../../core/componentClass/component.js";

export class SignButton extends Component {
    constructor(parent, config) {
        super(parent, config, "signButton");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (buttons, button) => buttons + this.template(button),
            ""
        );
    }
}
