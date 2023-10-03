const express = require("express");
const routes = require("./router/router.js");
const app = express();

app.use(routes);

app.listen(8080, () => {
  console.log("Started at 80");
});
