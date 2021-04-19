const express = require("express");
const router = express.Router();
const {
  render_register,
  postRegister,
} = require("../../controllers/auth/register");
const { CheckSession } = require("../../tools/general-tools");

router.get("/register", CheckSession, render_register);
router.post("/register", postRegister);

module.exports = router;
