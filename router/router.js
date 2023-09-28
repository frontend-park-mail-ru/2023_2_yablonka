const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const createPath = (page) =>
  path.resolve(__dirname, "../static/html", `${page}.html`);

router.use(express.static(path.resolve(__dirname, "../static/css")));
router.use(express.static(path.resolve(__dirname, "../static/img")));
router.use(express.static(path.resolve(__dirname, "../static/svg")));

router.get("/signup", (req, res) => {
  const filePath = createPath("signup");
  if (!fs.existsSync(filePath)) {
    res.status(500).send("This page not found. 500");
    return;
  }
  res.sendFile(filePath);
});

router.get("/signin", (req, res) => {
  const filePath = createPath("signin");
  if (!fs.existsSync(filePath)) {
    res.status(500).send("This page not found. 500");
    return;
  }
  res.sendFile(filePath);
});

router.get("/", (req, res) => {
  const filePath = createPath("main");
  if (!fs.existsSync(filePath)) {
    res.status(500).send("This page not found. 500");
    return;
  }
  res.sendFile(filePath);
});

router.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

module.exports = router;
