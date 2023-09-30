export class Background {
  #parent;
  #backgroundElement;

  constructor(parent, backgroundElement) {
    this.#parent = parent;
    this.#backgroundElement = backgroundElement;
  }

  render() {
    console.log(Handlebars);
    const template = Handlebars.compile["Background.hbs"];

    this.#parent.innerHTML = template({});
  }
}
