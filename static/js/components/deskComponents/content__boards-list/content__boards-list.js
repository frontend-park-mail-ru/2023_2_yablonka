import { Component } from "../../core/componentClass/component.js";

export class ContentBoardsList extends Component {
    constructor(parent, config) {
        super(parent, config, "content__boards-list");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (inputs, input) => inputs + this.template(input),
            ""
        );
    }
}
