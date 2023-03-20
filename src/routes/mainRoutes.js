const { Router } = require("express");
const { checkUser, requireAuth } = require("../middleware/requireAuth");
const router = Router();
const config = require("../config/config.json");
const Userdetails = require("../models/Userdetails");
const Server = require("../models/Server");
const Invite = require("../models/Invite");
const fs = require("fs");

router.get("/", checkUser, (req, res) => {
  res.render("./index", { config: config });
});

router.get("/download", checkUser, (req, res) => {
  res.render("./download", { config: config });
});

//app

router.get("/app", requireAuth, checkUser, (req, res) => {
  res.render("./app/app", { config: config });
});

router.get("/servers", requireAuth, checkUser, (req, res) => {
  res.render("./app/servers", { config: config });
});

router.get("/friends", requireAuth, checkUser, (req, res) => {
  res.render("./app/friends", { config: config });
});

router.get("/billing", requireAuth, checkUser, (req, res) => {
  res.render("./app/billing", { config: config });
});

router.get("/settings", requireAuth, checkUser, (req, res) => {
  res.render("./app/settings", { config: config });
});

router.get("/logout", (req, res) => {
  res.clearCookie("_DO_NOT_SHARE_TOKEN", "");
  res.redirect("/");
});

//Users api
router.get("/api/users/:user", async (req, res) => {
  const username = req.params.user;

  const user = await Userdetails.findOne({ username: username });

  if (username === "all") {
    const user = await Userdetails.find();

    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ user: user }, null, 4));
  } else if (user) {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(user, null, 4));
  } else {
    res.json({ user: "this user does not exists" });
  }

  if (!username) {
    res.redirect("/");
  }
});

//Profile
router.get("/u/:username", checkUser, async (req, res) => {
  const username = req.params.username;

  const user_ = await Userdetails.findOne({ username: username });

  if (user_) {
    res.render("[u]", { user_: user_, config: config });
  } else {
    res.render("[u]", { user_: "", config: config });
  }
});

//Invite link
router.get("/inv/:invite", checkUser, async (req, res) => {
  const invite_link = req.params.invite

  const server = await Server.findOne({ server_link: `${config.CLIENT_URL}/inv/${invite_link}` });
  const invite = await Invite.findOne({ invite_link: `${config.CLIENT_URL}/inv/${invite_link}` });

  if(!server && !invite) {
    res.render("[inv]", { server: server, invite: invite, config: config })
  } else {
    res.render("[inv]", { server: "", invite: "", config: config });
  }
})

module.exports = router;
