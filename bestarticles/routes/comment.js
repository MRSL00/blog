const express = require("express");
const router = express.Router();
const {
  creatComment,
  deleteComment,
  editComment,
} = require("../controllers/comment");
const { deleteCommentAcc, editCommentAcc } = require("../tools/acc");

router.post("/comment", creatComment);
router.put("/comment/:id", editCommentAcc, editComment);
router.delete("/comment/:id", deleteCommentAcc, deleteComment);

module.exports = router;
