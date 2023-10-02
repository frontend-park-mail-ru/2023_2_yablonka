import { Component } from "../../core/componentClass/component.js";

export class ContentHeader extends Component {
    constructor(parent, config) {
        super(parent, config, "contentHeader");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
