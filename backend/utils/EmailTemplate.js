const fs = require("fs");
const path = require("path");

function getBase64Image(filePath) {
  const imagePath = path.join(__dirname, filePath);
  const image = fs.readFileSync(imagePath);
  return `data:image/png;base64,${image.toString("base64")}`;
}

const gmailContent = (verificationToken) => {
  const logoBase64 = getBase64Image("../logo.png");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate { animation: fadeIn 0.5s ease-out forwards; }
        .bg-gradient { background: linear-gradient(to right, #FFA726, #E0E0E0); }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f4f7; font-family: 'Montserrat', Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 50px rgba(0,0,0,0.1);">
        <tr>
          <td style="padding: 0;">
            <div class="bg-gradient" style="padding: 60px 0; text-align: center;">
              <img src="https://res.cloudinary.com/djoybvxgn/image/upload/v1722684170/udo63kl55cf6q9npr1xx.png" alt="Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">Verify Your Email</h1>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 30px; background-color: #ffffff;">
            <p class="animate" style="color: #333333; font-size: 18px; line-height: 1.8; text-align: center; margin-bottom: 30px;">Welcome to our vibrant community! We're thrilled to have you join us. To start your journey, please verify your email address:</p>
            <div class="animate" style="text-align: center; margin-top: 40px;">
              <a href="${process.env.BACKEND_URL}/api/v1/auth/verify-email/${verificationToken}" style="display: inline-block; background: #F57C00; color: #ffffff; font-size: 18px; font-weight: 600; text-decoration: none; padding: 15px 30px; border-radius: 50px; transition: all 0.3s ease-in-out; box-shadow: 0 6px 20px rgba(245,124,0,0.4);">
                Verify Now
              </a>
            </div>
            <p class="animate" style="color: #666666; font-size: 14px; text-align: center; margin-top: 40px; font-style: italic;">If you didn't create an account, you can safely ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8f9fa; padding: 30px;">
            <div style="text-align: center; color: #333333; font-size: 14px;">
              <p style="margin-bottom: 10px;">&copy; 2024 Treyst Infotech Pvt Ltd. All rights reserved.</p>
              <p>
                <a href="#" style="color: #F57C00; text-decoration: none; margin: 0 10px; font-weight: 600;">Privacy Policy</a> | 
                <a href="#" style="color: #F57C00; text-decoration: none; margin: 0 10px; font-weight: 600;">Terms of Service</a>
              </p>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

const successFullVerification = () => {
  const logoBase64 = getBase64Image("../logo.png"); // Adjust the path as needed

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verified Successfully</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate { animation: fadeIn 0.5s ease-out forwards; }
        .bg-gradient { background: linear-gradient(to right, #FFA726, #E0E0E0); }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f4f7; font-family: 'Montserrat', Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 50px rgba(0,0,0,0.1);">
        <tr>
          <td style="padding: 0;">
            <div class="bg-gradient" style="padding: 60px 0; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">Congratulations!</h1>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 30px;">
            <p class="animate" style="color: #555; font-size: 18px; line-height: 1.8; text-align: center; margin-bottom: 30px; opacity: 0;">Your email has been successfully verified. Welcome to our vibrant community! We're absolutely thrilled to have you with us.</p>
            <div class="animate" style="text-align: center; margin-top: 40px; opacity: 0;">
              <a href="${process.env.FRONTEND_URL}/" style="display: inline-block; background: #F57C00; color: #ffffff; font-size: 18px; font-weight: 600; text-decoration: none; padding: 15px 30px; border-radius: 50px; transition: all 0.3s ease-in-out; box-shadow: 0 6px 20px rgba(245,124,0,0.4);">
                Explore Your Dashboard
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8f9fa; padding: 30px;">
            <div style="text-align: center; color: #888; font-size: 14px;">
              <p style="margin-bottom: 10px;">&copy; 2024 Your Company Name. All rights reserved.</p>
              <p>
                <a href="#" style="color: #F57C00; text-decoration: none; margin: 0 10px; font-weight: 600;">Privacy Policy</a> | 
                <a href="#" style="color: #F57C00; text-decoration: none; margin: 0 10px; font-weight: 600;">Terms of Service</a>
              </p>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

const passwordResetEmail = (resetToken) => {
  const logoBase64 = getBase64Image("../logo.png");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate { animation: fadeIn 0.5s ease-out forwards; }
        .bg-gradient { background: linear-gradient(to right, #FFA726, #E0E0E0); }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f4f7; font-family: 'Montserrat', Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 50px rgba(0,0,0,0.1);">
        <tr>
          <td style="padding: 0;">
            <div class="bg-gradient" style="padding: 60px 0; text-align: center;">
              <img src="https://res.cloudinary.com/djoybvxgn/image/upload/v1722684170/udo63kl55cf6q9npr1xx.png" alt="Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">Password Reset Request</h1>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 30px; background-color: #ffffff;">
            <p class="animate" style="color: #333333; font-size: 18px; line-height: 1.8; text-align: center; margin-bottom: 30px;">We received a request to reset your password. Click the button below to create a new password:</p>
            <div class="animate" style="text-align: center; margin-top: 40px;">
              <a href="${process.env.FRONTEND_URL}/change-password/${resetToken}" style="display: inline-block; background: #F57C00; color: #ffffff; font-size: 18px; font-weight: 600; text-decoration: none; padding: 15px 30px; border-radius: 50px; transition: all 0.3s ease-in-out; box-shadow: 0 6px 20px rgba(245,124,0,0.4);">
                Reset Password
              </a>
            </div>
            <p class="animate" style="color: #666666; font-size: 14px; text-align: center; margin-top: 40px; font-style: italic;">If you did not request this password reset, please ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8f9fa; padding: 30px;">
            <div style="text-align: center; color: #333333; font-size: 14px;">
              <p style="margin-bottom: 10px;">&copy; 2024 Treyst Infotech Pvt Ltd. All rights reserved.</p>
              <p>
                <a href="#" style="color: #F57C00; text-decoration: none; margin: 0 10px; font-weight: 600;">Privacy Policy</a> | 
                <a href="#" style="color: #F57C00; text-decoration: none; margin: 0 10px; font-weight: 600;">Terms of Service</a>
              </p>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

const otpEmailTemplate = (otp) => {
  const logoBase64 = getBase64Image('../logo.png'); // Adjust the path as needed

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate { animation: fadeIn 0.5s ease-out forwards; }
        .bg-gradient { background: linear-gradient(to right, #FFA726, #E0E0E0); }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f4f7; font-family: 'Montserrat', Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 50px rgba(0,0,0,0.1);">
        <tr>
          <td style="padding: 0;">
            <div class="bg-gradient" style="padding: 60px 0; text-align: center;">
              <img src="https://res.cloudinary.com/djoybvxgn/image/upload/v1722684170/udo63kl55cf6q9npr1xx.png" alt="Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">OTP Verification</h1>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 30px; background-color: #ffffff;">
            <p class="animate" style="color: #333333; font-size: 18px; line-height: 1.8; text-align: center; margin-bottom: 30px;">To complete your verification, please use the following OTP:</p>
            <div class="animate" style="text-align: center; margin-top: 40px;">
              <span style="display: inline-block; background: #F57C00; color: #ffffff; font-size: 24px; font-weight: 600; padding: 15px 30px; border-radius: 50px; transition: all 0.3s ease-in-out; box-shadow: 0 6px 20px rgba(245,124,0,0.4);">
                ${otp}
              </span>
            </div>
            <p class="animate" style="color: #666666; font-size: 14px; text-align: center; margin-top: 40px; font-style: italic;">If you did not request this OTP, please ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8f9fa; padding: 30px;">
            <div style="text-align: center; color: #333333; font-size: 14px;">
              <p style="margin-bottom: 10px;">&copy; 2024 Treyst Infotech Pvt Ltd. All rights reserved.</p>
              <p>
                <a href="#" style="color: #F57C00; text-decoration: none; margin: 0 10px; font-weight: 600;">Privacy Policy</a> | 
                <a href="#" style="color: #F57C00; text-decoration: none; margin: 0 10px; font-weight: 600;">Terms of Service</a>
              </p>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = {
  gmailContent,
  successFullVerification,
  passwordResetEmail,
  otpEmailTemplate
}
