"use strict";

window.onload = () => {
  var source = document.getElementById("background").innerHTML;
  var template = Handlebars.compile(source);
};
