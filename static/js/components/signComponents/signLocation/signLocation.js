import { Component } from "../../core/componentClass/component.js";

export class Location extends Component {
    constructor(parent, config) {
        super(parent, config, "signLocation");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (elements, element) => elements + this.template(element),
            ""
        );
    }
}
