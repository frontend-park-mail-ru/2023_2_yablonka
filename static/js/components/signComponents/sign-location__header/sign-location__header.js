import { Component } from "../../core/componentClass/component.js";

export class SignLocationHeader extends Component {
    constructor(parent, config) {
        super(parent, config, "sign-location__header");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (logos, logo) => logos + this.template(logo),
            ""
        );
    }
}
