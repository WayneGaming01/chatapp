const mongoose = require("mongoose");   
const config = require("../config/config.json");
const moment = require("moment");

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function generateChar(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const userSchema = mongoose.Schema({
    user_invite: {
        type: String,
    },
    user_avatar: {
        type: String,
    },
    server_avatar: {
        type: String,
    },
    invite_link: {
        type: String,
    },
    created_at: {
        type: String,
        default: moment().format("MMMM Do YYYY"),
    }
});

userSchema.post("save", function (doc) {
  console.log(`A new server was created ${doc}`);
});

const Server = mongoose.model("server", userSchema);

module.exports = Server;
