const { Router } = require("express");
const { checkUser, requireAuth } = require("../middleware/requireAuth");
const router = Router();
const config = require("../config/config.json");
const Userdetails = require("../models/Userdetails");
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

router.get("/server", requireAuth, checkUser, (req, res) => {
  res.send("Not available <a href='/app'>Go back</a>");
});

router.get("/friends", requireAuth, checkUser, (req, res) => {
  res.send("Not available <a href='/app'>Go back</a>");
});

router.get("/billing", requireAuth, checkUser, (req, res) => {
  res.send("Not available <a href='/app'>Go back</a>");
});

router.get("/settings", requireAuth, checkUser, (req, res) => {
  res.send("Not available <a href='/app'>Go back</a>");
});

router.get("/logout", (req, res) => {
  res.clearCookie("_DO_NOT_SHARE_TOKEN", "");
  res.redirect("/");
});

//Profile
router.get("/api/users/:user", async (req, res) => {
  const username = req.params.user;

  const user = await Userdetails.findOne({ username: username });

  if (username === "all") {
    const user = await Userdetails.find();

    res.json({ user });
  } else if (user) {
    res.json({ user: user });
  } else {
    res.json({ user: "this user does not exists" });
  }

  if (!username) {
    res.redirect("/");
  }
});

router.get("/api/users/get/all", async (req, res) => {});

module.exports = router;
