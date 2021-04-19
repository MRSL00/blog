const express = require("express");
const router = express.Router();
const { render_login, postLogin,logout,Recover_Pass_MSG } = require("../../controllers/auth/login");
const { CheckSession } = require("../../tools/general-tools");

router.get("/login", CheckSession, render_login);
router.get("/logout", logout);
router.post("/login", postLogin);
router.post("/password_recovery", Recover_Pass_MSG);

module.exports = router;
