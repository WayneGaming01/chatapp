const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Userdetails = require("../models/Userdetails");
const config = require("../config/config.json");

const requireAuth = (req, res, next) => {
  const _DO_NOT_SHARE_TOKEN = req.cookies._DO_NOT_SHARE_TOKEN;

  if (_DO_NOT_SHARE_TOKEN) {
    jwt.verify(
      _DO_NOT_SHARE_TOKEN,
      config.JWT.JWT_AUTH,
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect("/");
          next();
        } else {
          const user = await User.findById(decodedToken.id);
          next();
        }
      }
    );
  } else {
    res.redirect("/");
  }
};

const checkUser = (req, res, next) => {
  const _DO_NOT_SHARE_TOKEN = req.cookies._DO_NOT_SHARE_TOKEN;

  if (_DO_NOT_SHARE_TOKEN) {
    jwt.verify(
      _DO_NOT_SHARE_TOKEN,
      config.JWT.JWT_AUTH,
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.locals.user = "";
          res.locals.userforDetailsfindOne = "";
          next();
        } else {
          const user = await User.findById(decodedToken.id);
          let userforDetailsfindOne = await Userdetails.findOne({
            username: user.username,
          });
          res.locals.user = user;
          res.locals.userforDetailsfindOne = userforDetailsfindOne;
          next();
        }
      }
    );
  } else {
    res.locals.user = "";
    res.locals.userforDetailsfindOne = "";
    next();
  }
};

module.exports = {
  requireAuth,
  checkUser,
};
