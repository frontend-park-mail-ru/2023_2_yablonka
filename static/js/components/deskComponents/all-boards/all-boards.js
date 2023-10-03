import { Component } from "../../core/componentClass/component.js";

export class AllBoards extends Component {
    constructor(parent, config) {
        super(parent, config, "all-boards");
    }

    render() {
        this.parent.innerHTML += this.template();
    }
}
