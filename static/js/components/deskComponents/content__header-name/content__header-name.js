import { Component } from "../../core/componentClass/component.js";

export class ContentHeaderName extends Component {
    constructor(parent, config) {
        super(parent, config, "content__header-name");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
