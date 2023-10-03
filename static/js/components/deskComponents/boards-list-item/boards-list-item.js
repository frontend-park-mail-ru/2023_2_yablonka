import { Component } from "../../core/componentClass/component.js";

export class BoardsListItem extends Component {
    constructor(parent, config) {
        super(parent, config, "boards-list-item");
    }

    render() {
        this.parent.innerHTML += this.template()
    }
}
