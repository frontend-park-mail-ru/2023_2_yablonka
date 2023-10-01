import { Component } from "../../core/componentClass/component.js";

export class FormComponent extends Component {
    constructor(parent, config) {
        super(parent, config, "formComponent");
    }

    render() {
        this.parent.innerHTML += this.template();
    }
}
