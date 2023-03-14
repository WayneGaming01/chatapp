const { Router } = require("express");
const { checkUser, requireAuth } = require("../middleware/requireAuth");
const router = Router();
const config = require("../config/config.json");
const browser = require("browser-detect");

router.get("/", (req, res) => {
  res.render("./index", { config: config });
});

// const parseIp = (req) =>
//     req.headers['x-forwarded-for']?.split(',').shift()
//     || req.socket?.remoteAddress

// console.log(parseIp(req))
// // => 127.0.0.1

router.get("/1", (req, res) => {
  res.send(JSON.stringify(browser(req.headers["user-agent"])));
});

router.get("/app", requireAuth, checkUser, (req, res) => {
  res.render("./app/app", { config: config });
});

router.get("/logout", (req, res) => {
  res.clearCookie("_DO_NOT_SHARE_TOKEN", "");
  res.redirect("/");
});

module.exports = router;
