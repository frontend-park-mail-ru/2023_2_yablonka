const express = require("express");
const routes = require("./router/router.js");
const app = express();

app.use(routes);

app.listen(80, () => {
  console.log("Started at 80");
});
