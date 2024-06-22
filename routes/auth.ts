import nodemailer from "nodemailer";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AUTHENTICATION_EXPIRATION_HOURS } from "../utils.js";
import { generateOTP } from "../utils/generateOTP.js";
import { validateEmail } from "../utils/validateEmail.js";
import { userData } from "./db.js";
import { client } from "../graphql/index.js";
import { GET_USER_TEST_VALUE } from "../graphql/queries.js";

dotenv.config();

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email }: { email: string | undefined } = req.body;

  if (!email) {
    return res.status(400).send("email is required");
  }

  const isEmailValid = validateEmail(email);

  if (!isEmailValid) {
    return res.status(400).send("email is not valid");
  }

  const isTestUser = await getIsTestUsers({ email });

  const OTP = generateOTP(isTestUser);

  res.status(200).json({ OTP, isEmailValid });

  sendOTPToUser(email, OTP);
});

//

router.post("/authenticate", async (req, res) => {
  const { email, token } = req.body;

  const dbToken = userData
    ?.map((item) => {
      if (item.tokenData.token === token) {
        return item.tokenData;
      }
    })
    .filter((token) => token !== undefined)[0];

  console.log("token ", dbToken);

  if (!dbToken) {
    return res.sendStatus(401).json("Invalid token");
  }

  if (dbToken.expiration < new Date()) {
    return res.status(401).json({ error: "Token expired!" });
  }

  const expiration = new Date(
    new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
  );

  // apitoken for user session nad it is used in below jwttoken

  const jwt_token = jwt.sign({ token }, process.env.JWT_SECRET || "abcd", {
    expiresIn: "12d",
  });

  res.cookie("jwt", jwt_token, {
    maxAge: 12 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
  });

  res.json({ jwt_token });
});
export default router;

const getIsTestUsers = async (userDetails: { email: string }) => {
  const result = await client.request(GET_USER_TEST_VALUE, {
    email: userDetails.email,
  });
  const isTest = result.users_user?.[0]?.isTest;

  return isTest || false;
};
const sendOTPToUser = async (email: string, OTP: string) => {
  // send OTP to user
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

  console.log("nodemail");
  let mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Pokepedia OTP",
    text: `Welcome to Pokepedia, your one time password is ${OTP}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully!");
    }
  });
};
