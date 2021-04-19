const express = require("express");
const router = express.Router();
const { adminAcc } = require("../tools/acc");
const {
  render_allusersPage,
  reset_password,
  deleteUser,
} = require("../controllers/admin");

router.get("/allusers/:page/:num", adminAcc, render_allusersPage);
router.put("/restpassword/:id", adminAcc, reset_password);
router.delete("/allusers/:id", adminAcc, deleteUser);

module.exports = router;
