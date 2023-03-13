const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const compression = require("compression");
const config = require("./src/config/config.json");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mainRoutes = require("./src/routes/mainRoutes");
const authRoutes = require("./src/routes/authRoutes");
const mongoose = require("mongoose");
const { requireAuth, checkUser } = require("./src/middleware/requireAuth");
require("./src/config/connection")();
app.set("view engine", "ejs");
app.set("views", "./src/public/");
app.use(
  compression({
    level: 6,
    threshold: 0,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }

      return compression.filter(req, res);
    },
  })
);
app.use("/library/js", express.static("./src/library/js"));
app.use("/library/css", express.static("./src/library/css"));
app.use("/routes/email/templates", express.static("./src/routes/templates"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(mainRoutes);
app.use(authRoutes);
mongoose.set("strictQuery", false);

app.get("*", checkUser);

//Server configuration
app.listen(config.PORT, () => {
  console.log("Server running at port " + config.CLIENT_URL);
});
