const User = require("../models/user");
const bcrypt = require("bcrypt");
const { DelImg } = require("../tools/general-tools");

const fieldsPattern = [
  "firstname",
  "lastname",
  "username",
  "email",
  "password",
  "gender",
  "mobile",
  "newpassword",
];

const render_profile = (req, res) => {
  res.render("profile/profile", { data: req.session.user });
};

const render_editPage = (req, res) => {
  res.render("profile/edit_profile", {
    data: req.session.user,
    succ: req.flash("succ"),
    err: req.flash("err"),
  });
};

const editProfile = (req, res) => {
  const bodyKeys = Object.keys(req.body);
  const checkFieldsResult = fieldsPattern.every((field) =>
    bodyKeys.includes(field)
  );
  const body_len = req.file ? 8 : 9;
  if (!checkFieldsResult || bodyKeys.length !== body_len) {
    req.flash("err", "Server err!!! check your inputs");
    if (req.file) {
      DelImg(req.file.filename, "avatars");
    }
    return res.status(400).json("err");
  }

  bcrypt.compare(
    req.body.password,
    req.session.user.password,
    async function (err, isMatch) {
      if (err) {
        req.flash("err", "Server err!!!");
        if (req.file) {
          DelImg(req.file.filename, "avatars");
        }
        return res.status(500).json("err");
      }

      if (!req.body.password) {
        req.flash("err", "Please enter your password");
        if (req.file) {
          DelImg(req.file.filename, "avatars");
        }
        return res.status(400).json("err");
      }

      if (!isMatch) {
        req.flash("err", "Wrong password!!!");
        if (req.file) {
          DelImg(req.file.filename, "avatars");
        }
        return res.status(404).json("err");
      }

      if (req.body.password === req.body.newpassword) {
        req.flash("err", "Passwords are equl!!!");
        if (req.file) {
          DelImg(req.file.filename, "avatars");
        }
        return res.status(400).json("err");
      }

      if (req.file) {
        if (req.session.user.avatar) {
          DelImg(req.session.user.avatar, "avatars");
        }
      }

      req.body.password = !req.body.newpassword
        ? req.body.password
        : req.body.newpassword;

      try {
        const userUpdate = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            gender: req.body.gender,
            mobile: req.body.mobile,
            lastUpdate: Date.now(),
            password: req.body.password,
            ...(req.file && { avatar: req.file.filename }),
          },
          { new: true }
        );

        userUpdate.save(async (err) => {
          if (err) {
            await User.findOneAndUpdate(
              { _id: req.session.user._id },
              req.session.user,
              { new: true }
            );

            const Err = [];

            err.message
              .substr(24)
              .split(",")
              .filter((el) => Err.push(el.split(":")[1].trim()));

            req.flash("err", Err);
            if (req.file) {
              DelImg(req.file.filename, "avatars");
            }
            return res.status(400).json("err");
          }

          if (req.body.newpassword) {
            req.session.destroy(function (err) {
              res.redirect("/login");
            });
          } else {
            req.session.user = userUpdate;

            req.flash("succ", "Update was successful");

            res.status(200).json("succ");
          }
        });
      } catch (err) {
        if (req.file) {
          DelImg(req.file.filename, "avatars");
        }
        return res.status(500).redirect("http://localhost:5000/500");
      }
    }
  );
};
module.exports = { render_editPage, render_profile, editProfile };
