const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const config = require("../config/config.json");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    maxLength: [
      32,
      "Maximum username characters is 32! How long do you want your name to be?",
    ],
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    unique: true,
    minLength: [
      6,
      "Minimun password requirement is 6 characters! How can you protect your account like that:/",
    ],
  },
  vStatus: {
    type: String,
  },
  lastIPLogin: {
    type: String,
  },
});

userSchema.post("save", function (doc) {
  console.log(`A new user was created and saved ${doc}`);
});

userSchema.pre("save", async function (doc) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.statics.checkUser = async function (username) {
  try {
    const user = await this.findOne({ username });
    if (user) return false;

    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
  }
  throw Error("The email or password was incorrect, better find out.");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
