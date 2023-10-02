import { Component } from "../../core/componentClass/component.js";

export class Sign_Location extends Component {
    constructor(parent, config) {
        super(parent, config, "sign-location");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (elements, element) => elements + this.template(element),
            ""
        );
    }
}
