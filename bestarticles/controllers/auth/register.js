const User = require("../../models/user");

const fieldsPattern = [
  "firstname",
  "lastname",
  "username",
  "email",
  "password",
  "gender",
  "mobile",
];

const render_register = (req, res) => {
  res.render("auth/register", { err: req.flash("err") });
};

const postRegister = (req, res) => {
  const bodyKeys = Object.keys(req.body);
  bodyKeys.pop();
  const checkFieldsResult = fieldsPattern.every((field) =>
    bodyKeys.includes(field)
  );
  //  ##################  check body response ######################
  if (!checkFieldsResult || bodyKeys.length !== 7) {
    req.flash("err", "Server err!!! check your inputs");
    return res.status(400).redirect("register");
  }

  //  ##################  check password and confirm password ######################
  if (req.body.password !== req.body.confirm) {
    req.flash("err", "The passwords are unequal!!!");
    return res.status(400).redirect("register");
  }

  delete req.body.confirm;
  
  //  ##################  Add a new blogger ######################
  const newUser = new User(req.body);
  newUser.save({}, (err) => {
    if (err) {
      if (err.code === 11000) {
        req.flash("err", "This Username has already been selected!!!");
        return res.status(400).redirect("register");
      }

      const Err = [];

      err.message
        .substr(24)
        .split(",")
        .filter((el) => Err.push(el.split(":")[1].trim()));

      req.flash("err", Err);

      return res.status(400).redirect("register");
    }

    res.status(200).redirect("login");
  });
};

module.exports = { render_register, postRegister };
