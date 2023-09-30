"use strict";

import { Background } from "./components/background/Background.js";

window.onload = () => {
  const rootElement = document.querySelector(".page");
  const background = document.createElement("div");

  const bg = new Background(rootElement, background);
  bg.render();
};
