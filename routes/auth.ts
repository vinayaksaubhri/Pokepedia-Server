import dotenv from "dotenv";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { client } from "../graphql/index.js";
import {
  CREATE_NEW_USER,
  INSERT_OTP,
  RESET_OTP_IS_VALID,
} from "../graphql/mutation.js";
import {
  GET_USER_DETAILS,
  GET_USER_OTP,
  GET_USER_TEST_VALUE,
} from "../graphql/queries.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOTPToUser } from "../utils/sendOTPToUser.js";
import { validateEmail } from "../utils/validateEmail.js";

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
  const { email, otp } = req.body;

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
  const latestOTP = await getOTPFromDB(email);

  if (!latestOTP) {
    return res.status(400).send({
      message: "Invalid OTP",
      error: "Invalid OTP",
      success: false,
    });
  }

  if (latestOTP.emailToken !== otp) {
    return res.status(400).send({
      message: "Invalid OTP",
      error: "Invalid OTP",
      success: false,
    });
  }

  if (latestOTP.expirationDate < new Date()) {
    return res.status(400).send({
      message: "OTP expired",
      error: "OTP expired",
      success: false,
    });
  }
  let jwt_token = "";

  const { userExists, userDetails } = await getUserDetails({ email });

  if (!userExists) {
    const { userDetails } = await createNewUser(email);
    jwt_token = await generateJWTToken(userDetails.id);
  }
  jwt_token = await generateJWTToken(userDetails.id);

  resetOTPIsValid(email);

  return res.status(200).json({
    success: true,
    jwt_token,
    isTest: userDetails.isTest || false,
    isSignUpCompleted: userDetails.isSignUpCompleted || false,
    isBanned: userDetails.isBanned || false,
  });
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

async function getIsTestUsers(userDetails: { email: string }) {
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

async function getOTPFromDB(email: string) {
  try {
    const result = await client.request(GET_USER_OTP, {
      email,
    });
    return result.users_otpToken?.[0];
  } catch (error) {
    throw new Error("Error while fetching user OTP");
  }
}

async function getUserDetails(userDetails: { email: string }) {
  try {
    const result = await client.request(GET_USER_DETAILS, {
      email: userDetails.email,
    });
    return {
      userExists: result.users_user?.[0] ? true : false,
      userDetails: result.users_user?.[0] as {
        id: string;
        isTest: boolean;
        isSignUpCompleted: boolean;
        isBanned: boolean;
      },
    };
  } catch (error) {
    throw new Error("Error while fetching user details");
  }
}
async function createNewUser(email: string) {
  try {
    const result = await client.request(CREATE_NEW_USER, {
      email,
    });
    return {
      userDetails: result.users_user?.[0] as {
        id: string;
        isTest: boolean;
        isSignUpCompleted: boolean;
        isBanned: boolean;
      },
    };
  } catch (error) {
    throw new Error("Error while creating new user");
  }
}
async function generateJWTToken(userId: string) {
  const jwt_token = jwt.sign({ userId }, process.env.JWT_SECRET || "abcd", {
    expiresIn: "30d",
  });
  return jwt_token;
}
async function resetOTPIsValid(email: string) {
  try {
    const result = await client.request(RESET_OTP_IS_VALID, {
      email,
    });
  } catch (error) {
    throw new Error("Error while resetting OTP is valid");
  }
}
export default router;
