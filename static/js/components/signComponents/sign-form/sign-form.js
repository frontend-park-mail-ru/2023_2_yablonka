import { Component } from "../../core/componentClass/component.js";

export class SignForm extends Component {
    constructor(parent, config) {
        super(parent, config, "sign-form");
    }

    render() {
        this.parent.innerHTML += this.template();
    }
}
