import { Component } from "../../core/componentClass/component.js";

export class BoardTitleLogo extends Component {
    constructor(parent, config) {
        super(parent, config, "desk");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
