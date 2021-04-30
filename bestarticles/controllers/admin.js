const Users = require("../models/user");
const Comment = require("../models/comment");
const Articles = require("../models/article");
const nodemailer = require("nodemailer");
const { DelImg } = require("../tools/general-tools");

const render_allusersPage = async (req, res) => {
  try {
    const limit = +req.params.num;
    const pageNumber = +req.params.page;
    const countOfBloggers = await Users.count({ role: { $ne: "admin" } });
    const users = await Users.find({ role: { $ne: "admin" } })
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .exec();

    res.render("allusers.ejs", {
      data: req.session.user,
      users: users,
      countpage: Math.ceil(countOfBloggers / limit),
      limit: limit,
      page: pageNumber,
    });
  } catch (err) {
    res.status(500).redirect("http://localhost:5000/500");
  }
};

const reset_password = async (req, res) => {
  try {
    const user = await Users.find({ _id: req.body.userid });
    if (!user) return res.status(404).redirect("http://localhost:5000/404");
    const resetPass = await Users.findOneAndUpdate(
      { _id: req.body.userid },
      { password: `${user[0].firstname}${user[0].mobile}` },
      { new: true }
    );

    resetPass.save(async (err) => {
      if (err) {
        const Err = [];

        err.message
          .substr(24)
          .split(",")
          .filter((el) => Err.push(el.split(":")[1].trim()));

        return res.status(400).json(Err);
      }
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: req.session.user.email,
        pass: "99994444ffaa",
      },
    });

    const mailOptions = {
      from: req.session.user.email,
      to: user[0].email,
      subject: "Reset Password",
      text: `Your password has changed to ${user[0].firstname}${user[0].mobile}`,
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json("succ");
  } catch (err) {
    if ((err.responseCode = 535)) {
      return res.status(400).json("Invalid email");
    }
    res.status(500).redirect("http://localhost:5000/500");
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.params.id });
    if (!user) return res.status(404).redirect("http://localhost:5000/404");

    const userDeleted = await user.deleteOne();
    const deleteUsersComments = await Comment.deleteMany({
      author: userDeleted._id,
    });

    if (userDeleted.avatar) {
      DelImg(userDeleted.avatar, "avatars");
    }

    const findArticle = await Articles.find({ author: userDeleted._id });
    findArticle.map((el) => DelImg(el.cover, "covers"));

    const deleteUserArticles = await Articles.deleteMany({
      author: userDeleted._id,
    });

    res.status(200).json("succ");
  } catch (err) {
    if (err.message.includes("Cast")) {
      return res.status(404).redirect("http://localhost:5000/404");
    }
    return res.status(500).redirect("http://localhost:5000/500");
  }
};

module.exports = { render_allusersPage, reset_password, deleteUser };
