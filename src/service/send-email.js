const NodeMailer = require("nodemailer");
const config = require("../config/config.json");

const Ecredentials = NodeMailer.createTransport({
  host: config.MAIL_CREDENTIALS.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
      user: config.MAIL_CREDENTIALS.MAIL_USER,
      pass: config.MAIL_CREDENTIALS.MAIL_PASSWORD
  }
});

module.exports = { Ecredentials };
