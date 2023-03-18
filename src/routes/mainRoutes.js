const { Router } = require("express");
const { checkUser, requireAuth } = require("../middleware/requireAuth");
const router = Router();
const config = require("../config/config.json");
const User = require("../models/User");
const Userdetails = require("../models/Userdetails");

router.get("/", (req, res) => {
  res.render("./index", { config: config });
});

router.get("/app", requireAuth, checkUser, (req, res) => {
  res.render("./app/app", { config: config });
});

router.get("/logout", (req, res) => {
  res.clearCookie("_DO_NOT_SHARE_TOKEN", "");
  res.redirect("/");
});

//Profile
router.get("/api/users/:user", async (req, res) => {
  const username = req.params.user;

  const user = await User.findOne({ username: username });

  if(username === "all") {
    const user = await Userdetails.find();

    res.json({ users: user })
  } else if (user) {
    const details = {
      id: user._id,
      username: user.username,
      email_verified: user.email_verified,
    };

    res.json({ user: details });
  } else {
    res.json({ user: "this user does not exists" });
  }

  if (!username) {
    res.redirect("/");
  }
});

router.get("/api/users/get/all", async (req, res) => {

});

module.exports = router;
