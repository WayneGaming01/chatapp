const NodeMailer = require("nodemailer");

const emailinfo = {
  MAIL_HOST: "smtp.gmail.com",
  MAIL_USER: "waynegg21@gmail.com",
  MAIL_PASSWORD: "dpshwygttlpxlpnk",
};

const Ecredentials = NodeMailer.createTransport({
  host: emailinfo.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
      user: emailinfo.MAIL_USER,
      pass: emailinfo.MAIL_PASSWORD
  }
});

module.exports = { Ecredentials, emailinfo };
