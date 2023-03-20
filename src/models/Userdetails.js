const mongoose = require("mongoose");

const userdetailsSchema = mongoose.Schema({
  username: {
    type: String,
  },
  avatar: {
    type: String
  },
  profile_url: {
    type: String,
  },
  is_admin: {
    type: String,
  },
  bio: {
    type: String,
  },
  email_verified: {
    type: String,
  },
  created_at: {
    type: String,
  }
});

const Userdetails = mongoose.model("userdetails", userdetailsSchema);

module.exports = Userdetails;
