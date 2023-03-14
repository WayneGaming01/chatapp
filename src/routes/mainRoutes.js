const { Router } = require("express");
const { checkUser, requireAuth } = require("../middleware/requireAuth");
const router = Router();

router.get("/", (req, res) => {
  res.render("./index");
});

router.get("/app", requireAuth, checkUser, (req, res) => {
  res.render("./app/app");
});

router.get("/logout", (req, res) => {
  res.clearCookie("_DO_NOT_SHARE_TOKEN", "");
  res.redirect("/");
});

module.exports = router;
