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
const multer = require("multer");

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
        if (err) return res.send(err);

        const user = await User.findById(decodedToken.id);
        const userforDetails = await Userdetails.findOne({
          username: user.username,
        }).populate("ownedServers");
        const userforfindone = await Userdetails.findOne({
          username: user.username,
        });
        Server.find({}, (err, server) => {
          if (err) return res.send(err);

          const hasServerowned = userforfindone.ownedServers.some((server) =>
            server.equals(server._id)
          );

          res.render("./app/app", {
            config: config,
            userforDetails: userforDetails,
            userforfindone: userforfindone,
            hasServerowned,
            server: server,
          });
        }).limit(3);
        next();
      }
    );
  }
});

router.get("/servers", requireAuth, checkUser, (req, res, next) => {
  const _DO_NOT_SHARE_TOKEN = req.cookies._DO_NOT_SHARE_TOKEN;

  if (_DO_NOT_SHARE_TOKEN) {
    jwt.verify(
      _DO_NOT_SHARE_TOKEN,
      config.JWT.JWT_AUTH,
      async (err, decodedToken) => {
        if (err) return res.send(err);

        const user = await User.findById(decodedToken.id);
        const userforDetailsOwnedServers = await Userdetails.findOne({
          username: user.username,
        }).populate("ownedServers");
        const userforDetails = await Userdetails.findOne({
          username: user.username,
        }).populate("servers");
        const userforfindone = await Userdetails.findOne({
          username: user.username,
        });
        Server.find({}, (err, server) => {
          if (err) return res.send(err);

          const hasServerowned = userforfindone.ownedServers.some((server) =>
            server.equals(server._id)
          );

          const hasServer = userforfindone.servers.some((server) =>
            server.equals(server._id)
          );

          res.render("./app/servers", {
            config: config,
            userforDetails1: userforDetailsOwnedServers,
            userforDetails: userforDetails,
            userforfindone: userforfindone,
            hasServerowned,
            hasServer,
            server: server,
          });
        });
        next();
      }
    );
  }
});

router.get("/discover", requireAuth, checkUser, (req, res) => {
  res.render("./app/discover", { config: config });
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
    const { server_avatar, server_name, server_bio } = req.body;
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
            const userfindById = await User.findById(decodedToken.id);
            const userforDetails = await Userdetails.findOne({
              username: userfindById.username,
            });

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

            if (!server_avatar) {
              return res.json({
                errors: {
                  server_avatar: "No file for server avatar was uploaded!",
                },
              });
            }

            if (server_avatar.size / (1024 * 1024) > 2)
              return res.json({
                errors: {
                  server_avatar: "The size is too big! 2mb is maximum.",
                },
              });

            try {
              const server_avatar_generatedChar = generateChar(24);
              const server_owner = userfindById.username;
              const server_avatar1 = `/api/servers/${server_avatar_generatedChar}/avatar/${server_avatar}`;
              const members_count = 1; //By default because the owner...
              const user_avatar = `/api/users/${userfindById.username}/profile${userfindById.avatar}`;
              const generatedChar = generateChar(7);
              const server_link = `/inv/${generatedChar}`;
              const user = userfindById._id;
              const user_invite = userfindById.username;
              const server = await Server.create({
                server_name,
                server_bio,
                members_count,
                server_avatar1,
                server_link,
                server_owner,
                user,
              });
              await Invite.create({
                user_invite,
                user_avatar,
                server_avatar1,
                server_link,
              });
              const server_folder = `./src/api/servers/${server_avatar_generatedChar}`;
              await fs.mkdirSync(server_folder);
              await fs.mkdirSync(`${server_folder}/avatar/`);

              const storageEngine = multer.diskStorage({
                destination: function (req, file, cb) {
                  cb(
                    null,
                    `/src/api/servers/${server_avatar_generatedChar}/avatar/`
                  );
                },
                filename: (req, file, cb) => {
                  cb(null, `${Date.now()}--${file.originalname}`);
                },
              });

              const upload = multer({
                storage: storageEngine,
                limits: { fileSize: server_avatar.size / (1024 * 1024) > 2 },
              });

              upload.single("server_avatar");

              const serverfindOne = await Server.findOne({
                server_name: server_name,
              });

              server.users.push(userforDetails._id);
              await server.save();
              userforDetails.ownedServers.push(serverfindOne._id);
              await userforDetails.save();

              console.log(req.file);
              res.json({ server: serverfindOne.id });
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

  const userfindOne = await Userdetails.findOne({ username: username });

  if (userfindOne) {
    res.render("[u]", { userfindOne: userfindOne, config: config });
  } else {
    res.render("[u]", { userfindOne: "", config: config });
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

          const userforDetails = await Userdetails.findOne({
            username: user.username,
          });
          const serverfindOne = await Server.findOne({
            server_link: invite_link,
          });

          Userdetails.findOne(
            {
              username: userforDetails.username,
              servers: { $all: serverfindOne._id },
            },
            async (err, doc) => {
              if (err) {
                return res.json({
                  errors: {
                    invite_link: "You cannot join because of an error.",
                  },
                });
              } else if (doc) {
                return res.json({
                  errors: {
                    invite_link:
                      "You cannot join this server anymore because you're part of it!",
                  },
                });
              } else if (
                serverfindOne.server_owner === userforDetails.username
              ) {
                return res.json({
                  errors: {
                    invite_link:
                      "You cannot join this server because you're the owner!",
                  },
                });
              } else {
                try {
                  serverfindOne.users.push(userforDetails._id);
                  await serverfindOne.save();
                  userforDetails.servers.push(serverfindOne.id);
                  await userforDetails.save();
                  Server.findOneAndUpdate(
                    { _id: serverfindOne._id },
                    { $inc: { members_count: 1 } }
                  ).exec();

                  res.json({ server: "Joined the server successfully!" });
                  next();
                } catch (err) {
                  res.json({ errors: { invite_link: err } });
                  next();
                }
              }
            }
          );
        }
      );
    }
  }
);
router.get("/inv/:invite", requireAuth, checkUser, async (req, res) => {
  const invite = req.params.invite;
  const _DO_NOT_SHARE_TOKEN = req.cookies._DO_NOT_SHARE_TOKEN;

  const str = "aBcdEfs";

  if (!invite || invite.length < str.length || invite.length > str.length)
    return res.render("[inv]", {
      config: config,
      error: "The invite link is either expired or invalid!",
      success: "",
    });

  try {
    jwt.verify(
      _DO_NOT_SHARE_TOKEN,
      config.JWT.JWT_AUTH,
      async (err, decodedToken) => {
        if (err) return res.json(err);

        const userfindById = User.findById(decodedToken.id);
        const userforDetails = Userdetails.findOne({
          username: userfindById.username,
        });
        const server = Server.findOne({ server_link: invite });

        await Userdetails.findOne(
          { username: userforDetails.username, servers: { $all: server._id } },
          async (err, doc) => {
            if (err) {
              res.render("[inv]", {
                config: config,
                error: "You cannot join because of an error.",
                success: "",
              });
            } else if (doc) {
              res.render("[inv]", {
                config: config,
                error:
                  "You cannot join this server anymore because you're part of it!",
                success: "",
              });
            } else if (userforDetails.username === server.server_owner) {
              res.render("[inv]", {
                config: config,
                error: "You cannot join this server because you're the owner!",
                success: "",
              });
            } else {
              try {
                serverfindOne.users.push(userforDetails._id);
                await serverfindOne.save();
                userforDetails.servers.push(serverfindOne.id);
                await userforDetails.save();
                Server.findOneAndUpdate(
                  { _id: serverfindOne._id },
                  { $inc: { members_count: 1 } }
                ).exec();
                Userdetails.findOneAndUpdate(
                  { _id: userforDetails._id },
                  { $inc: { servers_count: 1 } }
                ).exec();

                res.render("[inv]", {
                  config: config,
                  errors: "",
                  success: "Successfully joined the server!",
                });
              } catch (err) {
                res.json({ errors: { invite: err } });
              }
            }
          }
        );
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
