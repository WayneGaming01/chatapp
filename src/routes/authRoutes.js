const { Router } = require("express");
const auth = require("../controller/auth");

const router = Router();

router.get("/verify", (req, res) => {
  res.redirect("/login");
});

router.get("/verify/:id", auth.verify);

router.post("/api/auth/signup", auth.signup);

router.post("/api/auth/login", auth.login);

module.exports = router;
