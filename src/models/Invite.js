const mongoose = require("mongoose");   
const config = require("../config/config.json");
const moment = require("moment");

const inviteSchema = mongoose.Schema({
    user_invite: {
        type: String,
    },
    user_avatar: {
        type: String,
    },
    server_avatar: {
        type: String,
    },
    server_link: {
        type: String,
        unique: true,
    },
    created_at: {
        type: String,
        default: moment().format("MMMM Do YYYY"),
    }
});

const Invite = mongoose.model("invite", inviteSchema);

module.exports = Invite;
