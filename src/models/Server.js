const mongoose = require("mongoose");
const config = require("../config/config.json");
const moment = require("moment");

const serverSchema = mongoose.Schema({
  server_name: {
    type: String,
  },
  server_bio: {
    type: String,
  },
  members_count: {
    type: Number,
  },
  server_avatar: {
    type: String,
  },
  server_link: {
    type: String,
    unique: true,
  },
  server_owner: {
    type: String,
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "userdetails" }],
  created_at: {
    type: String,
    default: moment().format("MMMM Do YYYY"),
  },
});

const Server = mongoose.model("server", serverSchema);

module.exports = Server;
