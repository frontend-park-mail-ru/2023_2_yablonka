import { Component } from "../../core/componentClass/component.js";

export class ButtonSign extends Component {
    constructor(parent, config) {
        super(parent, config, "button-sign");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (buttons, button) => buttons + this.template(button),
            ""
        );
    }
}
