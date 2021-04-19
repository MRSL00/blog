const mgs = require("mongoose");
const { hashPass } = require("./hooks");

const valid_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const valid_pass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const valid_phoneNumber = /^(\+98|0)?9\d{9}$/;
const check_gender = ["female", "male"];

const essentialSchema = {
  type: String,
  lowercase: true,
  trim: true,
};

const UserSchema = new mgs.Schema({
  avatar: {
    ...essentialSchema,
  },
  firstname: {
    ...essentialSchema,
    validate(value) {
      if (!value) {
        throw new Error("Please enter your firstname");
      }
    },
  },

  lastname: {
    ...essentialSchema,
    validate(value) {
      if (!value) {
        throw new Error("Please enter your lastname");
      }
    },
  },

  username: {
    ...essentialSchema,
    unique: true,
    validate(value) {
      if (!value) {
        throw new Error("Please enter your Username");
      } else if (value.length < 3) {
        throw new Error("username should be greater than 3 characters!!!");
      }
    },
  },

  email: {
    ...essentialSchema,
    validate(value) {
      if (!value) {
        throw new Error("Please enter your Email");
      } else if (!value.match(valid_email)) {
        throw new Error("invalid email!!!");
      }
    },
  },

  password: {
    type: String,
    validate(value) {
      if (!value) {
        throw new Error("Please enter your password");
      } else if (!value.match(valid_pass)) {
        throw new Error(
          "password should be more than 8 characters\nand a letter and number"
        );
      }
    },
  },

  gender: {
    ...essentialSchema,
    enum: ["female", "male"],
    validate(value) {
      if (!check_gender.includes(value)) {
        throw new Error("Please enter your gender");
      }
    },
  },

  mobile: {
    ...essentialSchema,
    validate(value) {
      if (!value) {
        throw new Error("Please enter your phone number");
      } else if (!value.match(valid_phoneNumber)) {
        throw new Error("invalid phone number");
      }
    },
  },

  role: {
    ...essentialSchema,
    enum: ["admin", "blogger"],
    default: "blogger",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  lastUpdate: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", hashPass);

module.exports = mgs.model("User", UserSchema);
