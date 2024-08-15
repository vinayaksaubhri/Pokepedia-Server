import nodemailer from "nodemailer";
export async function sendOTPToUser(email: string, OTP: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Pokepedia OTP",
    text: `Welcome to Pokepedia, your one time password is ${OTP}. OTP is valid for 10 minutes.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return new Error(error.message);
    } else {
      console.log("Email sent successfully!");
    }
  });
}
