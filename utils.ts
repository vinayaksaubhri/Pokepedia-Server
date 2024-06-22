import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
export const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
export const AUTHENTICATION_EXPIRATION_HOURS = 12;

export function generateEmailToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  // port: process.env.SMTP_PORT,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = (emailToken: string) => {
  console.log("nodemail");
  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: "tt033251@gmail.com",
    subject: "This is test mail",
    text: `Welcome to nodemailer, your one time password is ${emailToken}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully!");
    }
  });
};

// module.exports = { sendEmail };
