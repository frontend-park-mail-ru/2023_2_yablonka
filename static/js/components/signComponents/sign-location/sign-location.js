import { Component } from "../../core/componentClass/component.js";

export class SignLocation extends Component {
    constructor(parent, config) {
        super(parent, config, "sign-location");
    }

    render() {
        this.parent.innerHTML = this.template();
    }
}
