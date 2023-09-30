const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const createPath = (page) =>
  path.resolve(__dirname, "../public/static/html", `${page}.html`);

router.use(express.static(path.resolve(__dirname, "../public/static/css")));
router.use(express.static(path.resolve(__dirname, "../public/static/img")));
router.use(express.static(path.resolve(__dirname, "../public/static/svg")));
router.use(express.static(path.resolve(__dirname, "../public/static/js")));
router.use(express.static(path.resolve(__dirname, "..", "node_modules")));

function findView(view) {
  let views = ["signup", "signin", "main"];

  for (let i = 0; i, views.length; ++i) {
    if (views[i] == view) return true;
  }

  return false;
}

router.get("/:view?", (req, res) => {
  const view = req.params.view;
  let filePath;

  if (view == "/" || !view) {
    filePath = createPath("main");
  } else if (findView(view)) {
    filePath = createPath(view);
  }

  if (!fs.existsSync(filePath)) {
    res.status(404).send("404. Page not found");
    return;
  }

  res.sendFile(filePath);
});

module.exports = router;