const mgs = require("mongoose");

const ArticleSchema = new mgs.Schema({
  cover: {
    type: String,
    validate(value) {
      if (!value) {
        throw new Error("Please set a photo for cover");
      }
    },
  },
  title: {
    type: String,
    validate(value) {
      if (!value) {
        throw new Error("Your article should be have title");
      }
    },
  },
  content: {
    type: String,
    validate(value) {
      if (!value) {
        throw new Error("Your article should be have content");
      }
    },
  },
  viewer: [Array],
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
});

module.exports = mgs.model("Article", ArticleSchema);
