const { Router } = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { Ecredentials, emailinfo } = require("../service/send-email");
const config = require("../config/config.json");
const store = require("store2");
const getAge = require("findage");
const validator = require("email-validator");
const browser = require("browser-detect");

const router = Router();

//createToken
const createToken = (id) => {
  return jwt.sign({ id }, config.JWT.JWT_AUTH, {
    expiresIn: "365d",
  });
};

const createToken_ = (id) => {
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
    birthDate: "",
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

  if (err.message === "Mind selecting your birth date?") {
    errors.birthDate = "Mind selecting your birth date?";
  }

  if (
    err.message ===
    "Oops. Password did not match. You should try checking your spelling."
  ) {
    errors.password =
      "Oops. Passwords did not match. You should try checking your spelling.";
  }

  if (err.message === "You're too young to use " + config.CLIENT_NAME + "!") {
    errors.birthDate = "You're too young to use " + config.CLIENT_NAME + "!";
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
  res.render("./auth/signup");
});

router.get("/login", (req, res) => {
  res.render("./auth/login");
});

router.get("/verify", (req, res) => {
  res.redirect("/login");
});

router.get("/verify/:id", (req, res, next) => {
  const vToken = req.params.id;

  if (store.get("_VERIFICATION_TOKEN")) {
    jwt.verify(
      vToken,
      config.JWT.JWT_VERIFYTOKEN,
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.render("./auth/verify", {
            error: "This link has expired",
          });
          next();
        } else {
          const user = await User.findById(decodedToken.id);

          if (user.vStatus === "Verified") {
            res.render("./auth/verify", {
              error: "Your account is already verified!",
            });
          } else {
            store.remove("_VERIFICATION_TOKEN");
            User.findOneAndUpdate(
              { username: user.username },
              { $set: { vStatus: "Verified" } },
              { new: true },
              (err, doc) => {
                if (err) {
                  res.render("./auth/verify", { error: err.message });
                } else {
                  res.render("./auth/verify", { error: "" });
                }
              }
            );
          }
          return next();
        }
      }
    );
  }

  if (!vToken) {
    res.redirect("/");
  }
});

//post
router.post("/api/auth/signup", async (req, res, next) => {
  const { username, email, password, cpassword, birthDate } = req.body;

  var MyDate = new Date();
  var currentAge;

  currentAge =
    ("0" + (MyDate.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + MyDate.getDate()).slice(-2) +
    "/" +
    MyDate.getFullYear();

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
  } else if (password != cpassword) {
    return res.json({
      errors: handleErrors({
        message:
          "Oops. Password did not match. You should try checking your spelling.",
      }),
    });
  } else if (!birthDate) {
    return res.json({
      errors: handleErrors({ message: "Mind selecting your birth date?" }),
    });
  } else if (getAge.fullAge(birthDate) < "13 years 0 month 0 day") {
    return res.json({
      errors: handleErrors({
        message: "You're too young to use " + config.CLIENT_NAME + "!",
      }),
    });
  }

  try {
    const userExists = await User.checkUser(username);
    if (!userExists)
      return res.status(400).json({
        errors: handleErrors({
          message:
            "Someone else appears to have obtained the username before you.",
        }),
      });
    const lastIPLogin = req.socket.remoteAddress;
    const vStatus = "notVerified";
    const user = await User.create({
      username,
      email,
      password,
      birthDate,
      vStatus,
      lastIPLogin,
    });
    const token = createToken(user._id);
    const token_ = createToken_(user._id);

    store.set("_DO_NOT_SHARE_TOKEN", token, { httpOnly: true });
    store.set("_VERIFICATION_TOKEN", token_, { httpOnly: true });
    res.status(201).json({ user: user._id });

    const mailOptions = {
      from: emailinfo.MAIL_USER,
      to: email,
      subject: `Verification Status`,
      html: ``,
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
    res.status(400).json({ errors: handleErrors(err) });
    next();
  }
});

router.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!User.findOne({ email: email }))
    return res.json({
      errors: handleErrors_({
        message: "I guess you haven't signed up yet..",
      }),
    });

  if (!email)
    return res.json({
      errors: handleErrors_({
        message: "How can you login if you don't have your email...",
      }),
    });

  if (!password)
    return res.json({
      errors: handleErrors_({ message: "Mind putting your password?" }),
    });

  try {
    const user = await User.login(email, password);
    if (User.findOne({ lastIPLogin: req.socket.remoteAddress })) {
      const token = createToken(user._id);
      store.set("_DO_NOT_SHARE_TOKEN", token, { httpOnly: true });
      res.status(200).json({ user: user._id });
    } else {
      const token = createToken(user._id);
      store.set("_DO_NOT_SHARE_TOKEN", token, { httpOnly: true });
      const mailOptions = {
        from: emailinfo.MAIL_USER,
        to: email,
        subject: `<span>Someone has logged in to your account</span>`,
        html: `Someone has logged in to your account<br><br><span>IP ADDRESS: ${
          req.socket.remoteAddress
        }</span><br>${browser(req.headers["user-agent"])}`,
      };

      Ecredentials.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.json({ errors: handleErrors(error) });
        } else {
          console.log("Info sent: " + info.response);
          res.status(200).json({ message: "Info sent successfully" });
        }
      });
    }
  } catch (err) {
    res.json({ errors: handleErrors(err) });
  }
});

module.exports = router;
