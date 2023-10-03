import { Component } from "../../core/componentClass/component.js";

export class ButtonCreateWorkspace extends Component {
    constructor(parent, config) {
        super(parent, config, "button__create-workspace");
    }

    render() {
        this.parent.innerHTML = this.template();
    }
}
