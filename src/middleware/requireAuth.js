const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Userdetails = require("../models/Userdetails");
const config = require("../config/config.json");

const requireAuth = (req, res, next) => {
  const _DO_NOT_SHARE_TOKEN = req.cookies._DO_NOT_SHARE_TOKEN;

  if (_DO_NOT_SHARE_TOKEN) {
    jwt.verify(_DO_NOT_SHARE_TOKEN, config.JWT.JWT_AUTH, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
        next();
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const _DO_NOT_SHARE_TOKEN = req.cookies._DO_NOT_SHARE_TOKEN;

  if (_DO_NOT_SHARE_TOKEN) {
    jwt.verify(_DO_NOT_SHARE_TOKEN, config.JWT.JWT_AUTH, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        let user_ = await Userdetails.findOne(decodedToken.username);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        res.locals.user_ = user_;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = {
  requireAuth,
  checkUser,
};
