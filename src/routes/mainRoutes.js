const { Router } = require("express");
const { checkUser, requireAuth } = require("../middleware/requireAuth");
const router = Router();
const config = require("../config/config.json");
const Userdetails = require("../models/Userdetails");
const Server = require("../models/Server");
const Invite = require("../models/Invite");
const User = require("../models/User");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  console.log(err.message, err.code);

  let errors = {
    server_name: "",
  };

  if (err.message === "Enter a name for your server to create!") {
    errors.server_name = "Enter a name for your server to create!";
  }

  return errors;
};

//main

router.get("/", checkUser, (req, res) => {
  res.render("./index", { config: config });
});

router.get("/download", checkUser, (req, res) => {
  res.render("./download", { config: config });
});

//app

router.get("/app", requireAuth, checkUser, async (req, res, next) => {
  const _DO_NOT_SHARE_TOKEN = req.cookies._DO_NOT_SHARE_TOKEN;

  if (_DO_NOT_SHARE_TOKEN) {
    jwt.verify(
      _DO_NOT_SHARE_TOKEN,
      config.JWT.JWT_AUTH,
      async (err, decodedToken) => {
        const user_ = await User.findById(decodedToken.id);
        const user = await Userdetails.findOne({
          username: user_.username,
        }).populate("servers");

        Server.find({}, (err, server) => {
          if (err) {
            res.send(err);
          } else {
            res.render("./app/app", {
              config: config,
              user__: user,
              server: server,
            });
          }
        }).limit(3);
        next();
      }
    );
  }
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

//createserver
router.post(
  "/api/add/server",
  checkUser,
  requireAuth,
  async (req, res, next) => {
    const { server_name, server_bio } = req.body;
    const _DO_NOT_SHARE_TOKEN = req.cookies._DO_NOT_SHARE_TOKEN;

    if (_DO_NOT_SHARE_TOKEN) {
      jwt.verify(
        _DO_NOT_SHARE_TOKEN,
        config.JWT.JWT_AUTH,
        async (err, decodedToken) => {
          if (err) {
            console.log(err.message);
            next();
          } else {
            const user_ = await User.findById(decodedToken.id);
            const user__ = await Userdetails.findOne({ username: user_.username });

            if (!server_name)
              return res.json({
                errors: handleErrors({
                  message: "Enter a name for your server to create!",
                }),
              });

            const characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

            function generateChar(length) {
              let result = "";
              const charactersLength = characters.length;
              for (let i = 0; i < length; i++) {
                result += characters.charAt(
                  Math.floor(Math.random() * charactersLength)
                );
              }

              return result;
            }

            try {
              const server_owner = user_.username;
              const server_avatar = "";
              const members_count = 1; //By default because the owner...
              const user_avatar = `${config.CLIENT_URL}/api/v1/users/${user_.username}/profile${user_.avatar}`;
              const generatedChar = generateChar(7);
              const server_link = `${config.CLIENT_URL}/inv/${generatedChar}`;
              const user = user_._id;
              const user_invite = user_.username;
              const server = await Server.create({
                server_name,
                server_bio,
                members_count,
                server_avatar,
                server_link,
                server_owner,
                user,
              });
              await Invite.create({
                user_invite,
                user_avatar,
                server_avatar,
                server_link,
              });

              const server__ = await Server.findOne({
                server_name: server_name,
              });

              server.users.push(user__._id);
              await server.save();
              user__.servers.push(server__._id);
              await user__.save();

              res.json({ server: server__.id });
              next();
            } catch (err) {
              res.json({ errors: handleErrors(err) });
              next();
            }

            next();
          }
        }
      );
    }
  }
);

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

//Invite api
router.post(
  "/api/join/server",
  requireAuth,
  checkUser,
  async (req, res, next) => {
    const invite_link = req.body.invite_link;
    const str = config.CLIENT_URL + "/inv/aBcdEfs";
    const _DO_NOT_SHARE_TOKEN = req.cookies._DO_NOT_SHARE_TOKEN;

    if (!invite_link)
      return res.json({
        errors: { invite_link: "This invite link is invalid!" },
      });

    if (
      invite_link.trim().length < str.length ||
      invite_link.trim().length > str.length
    )
      return res.json({
        errors: { invite_link: "This invite link is invalid!" },
      });

    if (_DO_NOT_SHARE_TOKEN) {
      jwt.verify(
        _DO_NOT_SHARE_TOKEN,
        config.JWT.JWT_AUTH,
        async (err, decodedToken) => {
          if (err) return console.error(err);

          const user = await User.findById(decodedToken.id);

          const user__ = await Userdetails.findOne({
            username: user.username,
          });
          const server__ = await Server.findOne({ server_link: invite_link });

          if (user__.username === server__.server_owner)
            return res.json({
              errors: {
                invite_link: "You cannot join this server because you own it!",
              },
            });

          const user___ = await Userdetails.find({
            servers: server__._id,
          });
          const server___ = await Server.find({
            users: user__._id,
          });

          if (user__.servers === server__._id && server___ === user__.id)
            return res.json({
              errors: {
                invite_link: "You have already joined on this server!",
              },
            });

          try {
            server__.users.push(user__._id);
            await server__.save();
            user__.servers.push(server__.id);
            await user__.save();
            server__.members_count += 1;
            await user__.save();

            res.json({ server: "Joined the server successfully!" });
            next();
          } catch (err) {
            res.json({ errors: { invite_link: err } });
            next();
          }
        }
      );
    }
  }
);
router.get("/inv/:invite", checkUser, async (req, res) => {
  const invite = req.params.invite;
  const _DO_NOT_SHARE_TOKEN = req.cookies._DO_NOT_SHARE_TOKEN;

  if (!_DO_NOT_SHARE_TOKEN) {
    res.redirect("/login");
  }

  try {
    jwt.verify(
      _DO_NOT_SHARE_TOKEN,
      config.JWT.JWT_AUTH,
      async (err, decodedToken) => {
        if (err) return res.status(500).json(err);

        const server = await Server.findOne({ server_link: invite });
        const user = await Userdetails.findOne({
          username: decodedToken.username,
        });

        server.users.push(user._id);
        await server.save();

        user.servers.push(server._id);
        await user.save();

        const server_ = await Userdetails.findById(user._id).populate(
          "servers"
        );
        res.redirect("/app", { config: config, server: server_ });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//Servers
router.get("/servers/:id", async (req, res) => {
  const server_id = req.params.id;
});

module.exports = router;
