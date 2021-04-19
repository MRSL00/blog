const express = require("express");
const router = express.Router();
const { UploadAvatar } = require("../tools/general-tools");


const {
  render_editPage,
  render_profile,
  editProfile,
} = require("../controllers/profile");

router.get("/profile", render_profile);
router.get("/profile/edit", render_editPage);
router.put("/profile/edit",UploadAvatar.single("avatar"), editProfile);

module.exports = router;
