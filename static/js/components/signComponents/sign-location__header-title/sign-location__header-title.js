import { Component } from "../../core/componentClass/component.js";

export class Sign_LocationHeader_Title extends Component {
    constructor(parent, config) {
        super(parent, config, "sign-location__header-title");
    }

    render() {
        this.parent.innerHTML += this.data.reduce(
            (titles, title) => titles + this.template(title),
            ""
        );
    }
}
