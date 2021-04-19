const express = require("express");
const router = express.Router();
const { UploadCover } = require("../tools/general-tools");
const { editArticleAcc, deleteArticleAcc } = require("../tools/acc");

const {
  render_allarticlesPage,
  render_createarticlePage,
  render_myarticlesPage,
  render_showarticlePage,
  postCreateArticle,
  render_EditArticlePage,
  EditArticle,
  DeleteArticle,
} = require("../controllers/article");

router.get("/allarticles/:page/:num", render_allarticlesPage);

router.get("/createarticle", render_createarticlePage);
router.post("/createarticle", UploadCover.single("cover"), postCreateArticle);

router.get("/myarticles/:page/:num", render_myarticlesPage);
router.get("/article/edit/:id", editArticleAcc, render_EditArticlePage);
router.put(
  "/article/edit/:id",
  editArticleAcc,
  UploadCover.single("cover"),
  EditArticle
);
router.delete("/article/:id", deleteArticleAcc, DeleteArticle);

router.get("/article/:id", render_showarticlePage);

module.exports = router;
