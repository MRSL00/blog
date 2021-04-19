const User = require("../models/user");
const fs = require("fs");
const path = require("path");

// check exsit admin and create admin
const createAdmin = () => {
  User.findOne({ role: "admin" }, (err, existAdmin) => {
    if (err) return console.log("err in create admin");
    if (existAdmin) return console.log("admin already exist");

    new User({
      firstname: "admin",
      lastname: "admin",
      username: "admin",
      email: "mohammad00site@gmail.com",
      password: "99994444ffaa",
      gender: "male",
      mobile: "09031234567",
      role: "admin",
    }).save((err) => {
      if (err) return console.log("err in create admin");
      console.log("admin created successfully");
    });
  });
};

// chack exist images file and create

const CreatAvatarFile = () => {
  if (fs.existsSync(path.join(__dirname, "../public/images"))) {
    return console.log("images file is exsit :)");
  } else {
    fs.mkdirSync(path.join(__dirname, "../public/images"));
    fs.mkdirSync(path.join(__dirname, "../public/images/avatars"));
    fs.mkdirSync(path.join(__dirname, "../public/images/covers"));
    return console.log("files created :)");
  }
};

module.exports = { createAdmin, CreatAvatarFile };
