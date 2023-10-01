import { Component } from "../../core/componentClass/component.js";

export class MainLogo extends Component {
    constructor(parent, config) {
        super(parent, config, "mainLogo");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (logos, logo) => logos + this.template(logo),
            ""
        );
    }
}
