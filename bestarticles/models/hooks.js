const bcrypt = require("bcrypt");

const hashPass = function (next) {
  const user = this;

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      return next();
    });
  });
  
};

module.exports = { hashPass };
