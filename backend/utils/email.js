const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
require('dotenv').config();
const { gmailContent, otpEmailTemplate } = require('./EmailTemplate')
const secret_key = process.env.JWT_SECRET;




const generateverificationToken = (email) => {
  console.log(secret_key)
  return jwt.sign({ email: email }, secret_key, { expiresIn: '1d' })
}


const sendVerificationEmail = async (recipientEmail, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      }

    })

    const emailcontent = gmailContent(verificationToken);
    console.log(process.env.EMAIL + "email this is")

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: recipientEmail,
      subject: 'Email Verification',
      html: emailcontent
    })

    console.log("Verification email has been sent");

  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}


const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: options.email,
      subject: options.subject,
      html: options.html
    });

    console.log("Email has been sent");

  } catch (error) {
    console.error('Error sending email:', error);
  }
};


const sendOTPEmail = async (recipientEmail, otp) => {
  try {
    console.log("sendingemail:", recipientEmail);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      }
    });

    const emailContent = otpEmailTemplate(otp);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: recipientEmail,
      subject: 'Your OTP Code',
      html: emailContent
    });

    console.log("OTP email has been sent");

  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
}

module.exports = {
  generateverificationToken,
  sendVerificationEmail,
  sendEmail,
  sendOTPEmail
}