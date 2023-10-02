import { Component } from "../../core/componentClass/component.js";

export class PageImage extends Component {
    constructor(parent, config) {
        super(parent, config, "page__image");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (pictures, picture) => pictures + this.template(picture),
            ""
        );
    }
}
