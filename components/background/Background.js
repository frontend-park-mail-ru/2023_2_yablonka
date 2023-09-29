export class Background {
  #parent;
  #backgroundElement;

  constructor(parent, backgroundElement) {
    this.#parent = parent;
    this.#backgroundElement = backgroundElement;
  }

  render() {
    this.#backgroundElement.classList.add("page__background");
    this.#parent.appendChild(this.#backgroundElement);
  }
}
