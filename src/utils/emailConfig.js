const nodemailer = require('nodemailer');
const { service , user , pass} = require('../config/config');
const logger = require('./logger');

const createTransporter =() => {
  return nodemailer.createTransport({
    service : service,
    host : "smtp.gmail.com",
    port : 465,
    secure : true,
    auth:{
      user : user,
      pass : pass
    }
});
}

const sendEmail = async (mailOptions) => {
  const transporter = createTransporter();
  try{
    transporter.sendMail(mailOptions);
  }
  catch(error){
    logger.error(`Error sending email: ${error.message}`);
    throw new Error('Could not send email');
  }
}


module.exports = { sendEmail };