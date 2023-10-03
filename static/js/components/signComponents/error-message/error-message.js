import { Component } from "../../core/componentClass/component.js";

export class ErrorMessage extends Component {
    constructor(parent, config) {
        super(parent, config, "error-message");
    }

    render() {
        const errorDiv = document.createElement("div");
        errorDiv.innerHTML = this.template();
        this.parent.insertBefore(errorDiv.firstChild, this.parent.firstChild);
    }
}
