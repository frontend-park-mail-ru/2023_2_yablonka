const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const createPath = (page) =>
  path.resolve(__dirname, "../static/html", `${page}.html`);

router.use(express.static(path.resolve(__dirname, "../static/css")));
router.use(express.static(path.resolve(__dirname, "../static/img")));
router.use(express.static(path.resolve(__dirname, "../static/svg")));

router.get("/:view?", (req, res) => {
  const view = req.params.view;
  let filePath;

  if (view == "/" || !view) {
    filePath = createPath("main");
  } else {
    filePath = createPath(view);
  }

  if (!fs.existsSync(filePath)) {
    res.status(404).send("404. Page not found");
    return;
  }

  res.sendFile(filePath);
});

module.exports = router;
