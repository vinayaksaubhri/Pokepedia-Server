import dotenv from "dotenv";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AUTHENTICATION_EXPIRATION_HOURS } from "../utils.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOTPToUser } from "../utils/sendOTPToUser.js";
import { validateEmail } from "../utils/validateEmail.js";
import { userData } from "./db.js";
import { client } from "../graphql/index.js";
import { INSERT_OTP } from "../graphql/mutation.js";
import { GET_USER_TEST_VALUE } from "../graphql/queries.js";

dotenv.config();

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email }: { email: string | undefined } = req.body;

    if (!email) {
      return res.status(400).send({
        message: "email is required",
        error: "email is required",
        success: false,
      });
    }

    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      return res.status(400).send({
        message: "email is not valid",
        error: "email is not valid",
        success: false,
      });
    }

    const isTestUser = await getIsTestUsers({ email });

    const OTP = generateOTP(isTestUser);

    await addOTPToDB(email, OTP);
    if (!isTestUser) {
      await sendOTPToUser(email, OTP);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error,
      success: false,
    });
  }
});

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
async function addOTPToDB(email: string, OTP: string) {
  try {
    const result = await client.request(INSERT_OTP, {
      email,
      emailToken: OTP,
    });
  } catch (error) {
    throw new Error("Error while adding OTP to the database");
  }
}

export async function getIsTestUsers(userDetails: { email: string }) {
  try {
    const result = await client.request(GET_USER_TEST_VALUE, {
      email: userDetails.email,
    });
    const isTest = result.users_user?.[0]?.isTest;

    return isTest || false;
  } catch (error) {
    throw new Error("Error while fetching user details");
  }
}

export default router;
