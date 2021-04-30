const Article = require("../models/article");
const Comment = require("../models/comment");

const { DelImg } = require("../tools/general-tools");

// ################# show all articles ##################
const render_allarticlesPage = async (req, res) => {
  try {
    const limit = +req.params.num;
    const pageNumber = +req.params.page;
    const countOfArticles = await Article.count({});
    const articles = await Article.find({})
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .populate("author", { username: 1 })
      .exec();

    res.render("article/allarticles.ejs", {
      data: req.session.user,
      articles: articles,
      countpage: Math.ceil(countOfArticles / limit),
      limit: limit,
      page: pageNumber,
    });
  } catch (err) {
    res.status(500).redirect("http://localhost:5000/500");
  }
};
//################# create new article ######################
const render_createarticlePage = (req, res) => {
  res.render("article/createarticle.ejs", {
    data: req.session.user,
    err: req.flash("err"),
  });
};

const fieldsPattern = ["title", "content"];

const postCreateArticle = async (req, res) => {
  const bodyKeys = Object.keys(req.body);
  const checkFieldsResult = fieldsPattern.every((field) =>
    bodyKeys.includes(field)
  );

  if (!checkFieldsResult || bodyKeys.length !== 2) {
    req.flash("err", "Server err!!! check your inputs");
    if (req.file) {
      DelImg(req.file.filename, "covers");
    }
    return res.status(400).redirect("createarticle");
  }

  if (!req.file) {
    req.flash("err", "Please set a cover for article");
    return res.status(400).redirect("createarticle");
  }

  const newArticle = new Article({
    cover: req.file.filename,
    ...req.body,
    author: req.session.user._id,
  });
  try {
    await newArticle.save();
    return res.status(200).redirect("myarticles/1/2");
  } catch (err) {
    const Err = [];

    err.message
      .substr(27)
      .split(",")
      .filter((el) => Err.push(el.split(":")[1].trim()));
    req.flash("err", Err);
    if (req.file) {
      DelImg(req.file.filename, "covers");
    }
    return res.status(400).redirect("createarticle");
  }
};

// ############### show login users articles ######################
const render_myarticlesPage = async (req, res) => {
  try {
    const limit = +req.params.num;
    const pageNumber = +req.params.page;
    const countOfArticles = await Article.count({
      author: req.session.user._id,
    });

    const articles = await Article.find({ author: req.session.user._id })
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .populate("author", { username: 1 })
      .exec();

    res.render("article/myarticles.ejs", {
      data: req.session.user,
      articles: articles,
      countpage: Math.ceil(countOfArticles / limit),
      limit: limit,
      page: pageNumber,
    });
  } catch (err) {
    res.status(500).redirect("http://localhost:5000/500");
  }
};
const render_EditArticlePage = async (req, res) => {
  try {
    const article = await Article.find({
      _id: req.params.id,
    });
    if (!article) return res.status(404).redirect("http://localhost:5000/404");
    res.render("article/editarticle.ejs", {
      data: req.session.user,
      article: article,
      err: req.flash("err"),
      succ: req.flash("succ"),
    });
  } catch (err) {
    res.status(500).redirect("http://localhost:5000/500");
  }
};
// edit article
const EditArticle = async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      req.flash("err", "Your article should be have content and title");
      if (req.file) {
        DelImg(req.file.filename, "covers");
      }
      return res.status(400).json("err");
    }
    const article = await Article.find({
      _id: req.params.id,
    });
    if (!article) return res.status(404).redirect("http://localhost:5000/404");
    if (req.file) {
      DelImg(article[0].cover, "covers");
    }
    console.log(req.params.id);
    await Article.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
        lastUpdate: Date.now(),
        cover: !req.file ? article[0].cover : req.file.filename,
      },
      { new: true }
    );
    req.flash("succ", "Update was successful");
    res.status(200).json("succ");
  } catch (err) {
    if (req.file) {
      DelImg(req.file.filename, "covers");
    }
    if (err.message.includes("Cast")) {
      return res.status(404).redirect("http://localhost:5000/404");
    }
    return res.status(500).redirect("http://localhost:5000/500");
  }
};
// delete article
const DeleteArticle = async (req, res) => {
  try {
    const del_article = await Article.findOneAndDelete({ _id: req.params.id });
    if (!del_article)
      return res.status(404).redirect("http://localhost:5000/404");
    DelImg(del_article.cover, "covers");
    await Comment.deleteMany({
      article: del_article._id,
    });

    res.status(200).json("succ");
  } catch (err) {
    if (err.message.includes("Cast")) {
      return res.status(404).redirect("http://localhost:5000/404");
    }
    return res.status(500).redirect("http://localhost:5000/500");
  }
};

// ###################### read article page ############################
const render_showarticlePage = async (req, res) => {
  try {
    const article = await Article.find({
      _id: req.params.id,
    }).populate("author", { username: 1 });

    const comments = await Comment.find({
      article: req.params.id,
    }).populate("author", { username: 1, avatar: 1 });

    if (!article) return res.status(404).json("article not found!!!");
    const checkViews = article[0].viewer.map(
      (el) => el[0] === req.session.user.username
    );

    if (!checkViews.includes(true)) {
      await Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { viewer: req.session.user.username } },
        { new: true }
      );
    }

    res.render("article/showarticle.ejs", {
      data: req.session.user,
      article: article,
      comments: comments,
    });
  } catch (err) {
    if (err.message.includes("Cast")) {
      return res.status(404).redirect("http://localhost:5000/404");
    }
    return res.status(500).redirect("http://localhost:5000/500");
  }
};

module.exports = {
  render_allarticlesPage,
  render_createarticlePage,
  render_myarticlesPage,
  render_showarticlePage,
  postCreateArticle,
  render_EditArticlePage,
  EditArticle,
  DeleteArticle,
};
