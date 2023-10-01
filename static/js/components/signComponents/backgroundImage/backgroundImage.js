import { Component } from "../../core/componentClass/component.js";

export class Image extends Component {
    constructor(parent, config) {
        super(parent, config, "backgroundImage");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (pictures, picture) => pictures + this.template(picture),
            ""
        );
    }
}
