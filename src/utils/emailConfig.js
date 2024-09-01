const nodemailer = require('nodemailer');
const { emailConfig } = require('../config/config');

const transporter = nodemailer.createTransport({
  service: emailConfig.service,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

module.exports = transporter;
