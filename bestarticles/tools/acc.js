const Article = require("../models/article");
const Comment = require("../models/comment");

const editArticleAcc = async (req, res, next) => {
  try {
    const article = await Article.find({
      _id: req.params.id,
    }).populate("author", { username: 1 });
    
    if (req.session.user.username === article[0].author.username) {
      return next();
    } else {
      
      return res.status(403).redirect("http://localhost:5000/403");
    }
  } catch (err) {
    if (err.message.includes("Cast")) {
      return res.status(404).redirect("http://localhost:5000/404");
    }
    
    return res.status(500).redirect("http://localhost:5000/500");
  }
};

const deleteArticleAcc = async (req, res, next) => {
  try {
    const article = await Article.find({
      _id: req.params.id,
    }).populate("author", { username: 1 });
    if (
      req.session.user.username === article[0].author.username ||
      req.session.user.role === "admin"
    ) {
      return next();
    } else {
      return res.status(403).redirect("http://localhost:5000/403");
    }
  } catch (err) {
    if (err.message.includes("Cast")) {
      return res.status(404).redirect("http://localhost:5000/404");
    }
    return res.status(500).redirect("http://localhost:5000/500");
  }
};

const adminAcc = (req, res, next) => {
  if (req.session.user.role === "admin") {
    return next();
  } else {
    return res.status(403).redirect("http://localhost:5000/403");
  }
};

const deleteCommentAcc = async (req, res, next) => {
  try {
    const comment = await Comment.find({
      _id: req.params.id,
    }).populate("author", { username: 1 });
    if (
      req.session.user.username === comment[0].author.username ||
      req.session.user.role === "admin"
    ) {
      return next();
    } else {
      return res.status(403).redirect("http://localhost:5000/403");
    }
  } catch (err) {
    if (err.message.includes("Cast")) {
      return res.status(404).redirect("http://localhost:5000/404");
    }
    return res.status(500).redirect("http://localhost:5000/500");
  }
};

const editCommentAcc = async (req, res, next) => {
  try {
    const comment = await Comment.find({
      _id: req.params.id,
    }).populate("author", { username: 1 });
    if (req.session.user.username === comment[0].author.username) {
      return next();
    } else {
      return res.status(403).redirect("http://localhost:5000/403");
    }
  } catch (err) {
    if (err.message.includes("Cast")) {
      return res.status(404).redirect("http://localhost:5000/404");
    }
    return res.status(500).redirect("http://localhost:5000/500");
  }
};

module.exports = {
  editArticleAcc,
  deleteArticleAcc,
  adminAcc,
  deleteCommentAcc,
  editCommentAcc,
};
