const express = require("express");
const router = express.Router();
const { CheakLogin } = require("../tools/general-tools");

router.use("/", require("./auth/register"));
router.use("/", require("./auth/login"));
router.use("/", CheakLogin, require("./profile"));
router.use("/", require("./article"));
router.use("/", require("./admin"));
router.use("/", require("./comment"));
router.use("/", require("./errorPages"));

module.exports = router;
