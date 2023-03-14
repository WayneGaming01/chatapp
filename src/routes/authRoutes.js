const { Router } = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { Ecredentials } = require("../service/send-email");
const config = require("../config/config.json");
const validator = require("email-validator");
const browser = require("browser-detect");

const router = Router();

//createToken
const create_DO_NOT_SHARE_TOKEN = (id) => {
  return jwt.sign({ id }, config.JWT.JWT_AUTH, {
    expiresIn: "365d",
  });
};

const create_VERIFICATION_TOKEN = (id) => {
  return jwt.sign({ id }, config.JWT.JWT_VERIFYTOKEN, {
    expiresIn: "20m",
  });
};

//handleErrors
const handleErrors_ = (err) => {
  console.log(err.message, err.code);

  let errors = {
    email: "",
    password: "",
  };

  if (err.message === "I guess you haven't signed up yet..") {
    errors.email = "I guess you haven't signed up yet.. .-.";
  }

  if (err.message === "The email or password was incorrect, better find out.") {
    errors.email = "The email or password was incorrect, better find out.";
  }

  if (err.message === "How can you login if you don't have your email...") {
    errors.email = "How can you login if you don't have your email...";
  }

  if (err.message === "Mind putting your password?") {
    errors.password = "Mind putting your password? ;-;";
  }

  return errors;
};

const handleErrors = (err) => {
  console.log(err.message, err.code);

  let errors = {
    username: "",
    email: "",
    password: "",
  };

  if (err.message === "Mind putting an username? uh..") {
    errors.username = "Mind putting an username? uh..";
  }

  if (err.message === "Mind putting an email? bruh.") {
    errors.email = "Mind putting an email? bruh.";
  }

  if (err.message === "Mind putting an password? zzz..") {
    errors.password = "Mind putting an password? zzz..";
  }

  if (
    err.message ===
    "Oops. Password did not match. You should try checking your spelling."
  ) {
    errors.password =
      "Oops. Passwords did not match. You should try checking your spelling.";
  }

  if (
    err.message ===
    `Please enter a valid email! We don't accept invalid email or no access to ${config.CLIENT_NAME}`
  ) {
    errors.email = `Please enter a valid email! We don't accept invalid email or no access to ${config.CLIENT_NAME}`;
  }

  if (
    err.message ===
    "Someone else appears to have obtained the username before you."
  ) {
    errors.username =
      "Someone else appears to have obtained the username before you.";
  }

  if (err.code === 11000) {
    errors.email = "Do you own this email? 🤨";

    return errors;
  }

  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach((properties) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

//get
router.get("/signup", (req, res) => {
  if (req.cookies._DO_NOT_SHARE_TOKEN) return res.redirect("/app");

  res.render("./auth/signup", { config: config });
});

router.get("/login", (req, res) => {
  if (req.cookies._DO_NOT_SHARE_TOKEN) return res.redirect("/app");

  res.render("./auth/login", { config: config });
});

router.get("/verify", (req, res) => {
  res.redirect("/login");
});

router.get("/verify/:id", async (req, res, next) => {
  const _VERIFICATION_TOKEN = req.params.id;

  jwt.verify(
    _VERIFICATION_TOKEN,
    config.JWT.JWT_VERIFYTOKEN,
    async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.render(
          "./auth/verify",
          {
            error: "This link has expired",
          },
          { config: config }
        );
        next();
      } else {
        const user = await User.findById(decodedToken.id);

        if (user.EmailVerified === "true") {
          res.render(
            "./auth/verify",
            {
              error: "Your account is already verified!",
            },
            { config: config }
          );
        } else {
          res.clearCookie("_VERIFICATION_TOKEN");
          await User.findOneAndUpdate(
            { username: user.username },
            { $set: { EmailVerified: "true" } },
            { new: true },
            function (err, doc) {
              if (err) {
                res.render("./auth/verify", {
                  error: err.message,
                  config: config,
                });
              } else {
                res.render("./auth/verify", { error: "", config: config });
              }
            }
          );
        }
        next();
      }
    }
  );

  if (!_VERIFICATION_TOKEN) {
    res.redirect("/");
  }
});

//post
router.post("/api/auth/signup", async (req, res, next) => {
  const { username, email, password, cpassword } = req.body;

  if (!username) {
    return res.json({
      errors: handleErrors({ message: "Mind putting an username? uh.." }),
    });
  } else if (!email) {
    return res.json({
      errors: handleErrors({ message: "Mind putting an email? bruh." }),
    });
  } else if (!validator.validate(email)) {
    return res.json({
      errors: handleErrors({
        message: `Please enter a valid email! We don't accept invalid email or no access to ${config.CLIENT_NAME}`,
      }),
    });
  } else if (!password) {
    return res.json({
      errors: handleErrors({ message: "Mind putting an password? zzz.." }),
    });
  } else if (password !== cpassword) {
    return res.json({
      errors: handleErrors({
        message:
          "Oops. Password did not match. You should try checking your spelling.",
      }),
    });
  }

  try {
    const userExists = await User.checkUser(username);
    if (!userExists)
      return res.json({
        errors: handleErrors({
          message:
            "Someone else appears to have obtained the username before you.",
        }),
      });
    const lastIPLogin = req.socket.remoteAddress;
    const EmailVerified = "false";
    const user = await User.create({
      username,
      email,
      password,
      EmailVerified,
      lastIPLogin,
    });
    const _DO_NOT_SHARE_TOKEN = create_DO_NOT_SHARE_TOKEN(user._id);
    const _VERIFICATION_TOKEN = create_VERIFICATION_TOKEN(user._id);

    res.cookie("_DO_NOT_SHARE_TOKEN", _DO_NOT_SHARE_TOKEN, {
      maxAge: 365 * 12 * 60 * 60,
      httpOnly: true,
    });
    res.cookie("_VERIFICATION_TOKEN", _VERIFICATION_TOKEN, {
      maxAge: 20 * 60 * 1000,
      httpOnly: true,
    });
    res.status(201).json({ user: user._id });

    const mailOptions = {
      from: config.MAIL_CREDENTIALS.MAIL_USER,
      to: email,
      subject: `Verify your account`,
      html: `Hey! Verify your account here: ${config.CLIENT_URL}/verify/${_VERIFICATION_TOKEN}`,
    };

    Ecredentials.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json({ errors: handleErrors(error) });
      } else {
        console.log("Info sent: " + info.response);
        res.status(200).json({ message: "Info sent successfully" });
      }
    });

    next();
  } catch (err) {
    res.json({ errors: handleErrors(err) });
    next();
  }
});

router.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.json({
      errors: handleErrors_({
        message: "How can you login if you don't have your email...",
      }),
    });
  } else if (!validator.validate(email)) {
    return res.json({
      errors: handleErrors({
        message: `Please enter a valid email! We don't accept invalid email or no access to ${config.CLIENT_NAME}`,
      }),
    });
  } else if (!User.findOne({ email: email })) {
    return res.json({
      errors: handleErrors_({
        message: "I guess you haven't signed up yet..",
      }),
    });
  } else if (!password) {
    return res.json({
      errors: handleErrors_({ message: "Mind putting your password?" }),
    });
  }

  try {
    const user = await User.login(email, password);
    const _DO_NOT_SHARE_TOKEN = create_DO_NOT_SHARE_TOKEN(user._id);

    if (
      User.findOne({ lastIPLogin: req.socket.remoteAddress }) ===
      req.socket.remoteAddress
    ) {
      res.cookie("_DO_NOT_SHARE_TOKEN", _DO_NOT_SHARE_TOKEN, {
        maxAge: 365 * 12 * 60 * 60,
        httpOnly: true,
      });
      res.status(200).json({ user: user._id });
    } else {
      await User.findOneAndUpdate(
        { username: user.username },
        { $set: { lastIPLogin: req.socket.remoteAddress } },
        { new: true }
      );

      res.cookie("_DO_NOT_SHARE_TOKEN", _DO_NOT_SHARE_TOKEN, {
        maxAge: 365 * 12 * 60 * 60,
        httpOnly: true,
      });
      const mailOptions = {
        from: config.MAIL_CREDENTIALS.MAIL_USER,
        to: email,
        subject: `Someone has logged in to your account`,
        html: `Someone has logged in to your account<br><br><span>IP ADDRESS: ${
          req.socket.remoteAddress
        }</span><br>${browser(req.headers["user-agent"])}`,
      };

      Ecredentials.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.json({ errors: handleErrors(error) });
        } else {
          console.log("Info sent: " + info.response);
          res.status(200).json({ user: user._id });
          res.redirect("/app");
        }
      });
    }
  } catch (err) {
    res.json({ errors: handleErrors_(err) });
  }
});

module.exports = router;
