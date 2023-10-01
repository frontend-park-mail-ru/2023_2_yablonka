import { Component } from "../../core/componentClass/component.js";

export class FormTitle extends Component {
    constructor(parent, config) {
        super(parent, config, "formTitle");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (titles, title) => titles + this.template(title),
            ""
        );
    }
}
