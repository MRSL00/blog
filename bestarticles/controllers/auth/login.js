const User = require("../../models/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const render_login = (req, res) => {
  res.render("auth/login", {
    err: req.flash("err"),
    alart_err: req.flash("error"),
    succ: req.flash("succ"),
  });
};

const postLogin = async (req, res) => {
  // ##################### check login inputs ##########################
  if (!req.body.username) {
    req.flash("err", "Please enter your Username");
    return res.status(400).redirect("login");
  } else if (!req.body.password) {
    req.flash("err", "Please enter your password");
    return res.status(400).redirect("login");
  }

  try {
    const { password, username } = req.body;
    const exsitUser = await User.findOne({ username: username });

    if (!exsitUser) {
      req.flash("err", "User not found!!!");
      return res.status(404).redirect("login");
    }

    bcrypt.compare(password, exsitUser.password, function (err, isMatch) {
      if (err) {
        req.flash("err", "Server err!!!");
        return res.status(500).redirect("login");
      }

      if (!isMatch) {
        req.flash("err", "Wrong password!!!");
        return res.status(404).redirect("login");
      }

      req.session.user = exsitUser;

      res.status(200).redirect("profile");
    });
  } catch (err) {
    req.flash("err", "Server err!!!");
    return res.status(500).redirect("login");
  }
};

const logout = (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/login");
  });
};

// send recovery email to admin
const Recover_Pass_MSG = async (req, res) => {
  try {
    const checkExsistEmail = await User.exists({
      email: req.body.emailaddress,
    });
    const getAdminEmail = await User.find({ role: "admin" });
    if (!checkExsistEmail) {
      req.flash("error", "User has not registered with this email !!!");
      return res.status(400).redirect("login");
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: req.body.emailaddress,
        pass: req.body.emailPass,
      },
    });

    const mailOptions = {
      from: req.body.emailaddress,
      to: getAdminEmail[0].email,
      subject: "Password Recovery",
      text: `hello, Im a blogger with this email ${req.body.emailaddress},I want to restore my password.`,
    };

    const info = await transporter.sendMail(mailOptions);
    
    req.flash("succ", "Message send. New password will be send to you");

    return res.status(200).redirect("login");
  } catch (err) {
    req.flash("error", "Invalid email or password");
    return res.status(500).redirect("login");
  }
};

module.exports = { render_login, postLogin, logout, Recover_Pass_MSG };
