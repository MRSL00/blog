const mgs = require("mongoose");

const CommentSchema = new mgs.Schema({
  comment: {
    type: String,
    validate(value) {
      if (!value) {
        throw new Error("you can not sent empty comment!");
      }
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mgs.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  article: {
    type: mgs.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
});

module.exports = mgs.model("Comment", CommentSchema);
