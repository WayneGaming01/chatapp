const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config.json");
const store = require("store2");

const requireAuth = (req, res, next) => {
  const token = store.get("_DO_NOT_SHARE_TOKEN");

  if (token) {
    jwt.verify(token, config.JWT.JWT_AUTH, (err, decodedToken) => {
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
  const token = store.get("_DO_NOT_SHARE_TOKEN");

  if (token) {
    jwt.verify(token, config.JWT.JWT_AUTH, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
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
