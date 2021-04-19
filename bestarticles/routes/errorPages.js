const express = require("express");
const router = express.Router();

router.get("/403", (req, res) => {
  res.render("403Page.ejs");
});
router.get("/404", (req, res) => {
  res.render("404Page.ejs");
});
router.get("/500", (req, res) => {
  res.render("500Page.ejs");
});
module.exports = router;
