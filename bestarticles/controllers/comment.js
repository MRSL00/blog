const Comment = require("../models/comment");

const creatComment = async (req, res) => {
 
  if (!req.body.comment || !req.body.article ) {
    return res.status(400).json("empty");
  }

  const newComment = new Comment({
    ...req.body,
    author: req.session.user._id,
  });
  try {
    await newComment.save();
    res.status(200).json("created");
  } catch (err) {
    return res.status(500).redirect("http://localhost:5000/500");
  }
};

const editComment = async (req, res) => {
  if (!req.body.comment) {
    return res.status(400).json("empty");
  }

  try {
    const update_comment = await Comment.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
        lastUpdate: Date.now(),
      },
      { new: true }
    );
    res.status(200).json("succ");
  } catch (err) {
    if (err.message.includes("Cast")) {
      return res.status(404).redirect("http://localhost:5000/404");
    }
    return res.status(500).redirect("http://localhost:5000/500");
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id });

    res.status(200).json("succ");
  } catch (err) {
    if (err.message.includes("Cast")) {
      return res.status(404).redirect("http://localhost:5000/404");
    }
    return res.status(500).redirect("http://localhost:5000/500");
  }
};

module.exports = { creatComment, deleteComment, editComment };
