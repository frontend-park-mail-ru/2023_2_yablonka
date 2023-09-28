const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const createPath = (page) =>
  path.resolve(__dirname, "static/html", `${page}.html`);

app.use(express.static(path.resolve(__dirname, "static/css")));
app.use(express.static(path.resolve(__dirname, "static/img")));
app.use(express.static(path.resolve(__dirname, "static/svg")));

app.get("/signup", (req, res) => {
  const filePath = createPath("signup");
  if (!fs.existsSync(filePath)) {
    res.status(500).send("This page not found. 500");
    return;
  }
  res.sendFile(filePath);
});

app.get("/signin", (req, res) => {
  const filePath = createPath("signin");
  if (!fs.existsSync(filePath)) {
    res.status(500).send("This page not found. 500");
    return;
  }
  res.sendFile(filePath);
});

app.get("/", (req, res) => {
  const filePath = createPath("main");
  if (!fs.existsSync(filePath)) {
    res.status(500).send("This page not found. 500");
    return;
  }
  res.sendFile(filePath);
});

app.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

app.listen(8080, () => {
  console.log("Started at 8080");
});
