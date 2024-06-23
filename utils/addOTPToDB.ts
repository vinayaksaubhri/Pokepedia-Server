import { client } from "../graphql";
import { INSERT_OTP } from "../graphql/mutation";

export async function addOTPToDB(email: string, OTP: string) {
  try {
    const result = await client.request(INSERT_OTP, {
      email,
      emailToken: OTP,
    });
  } catch (error) {
    throw new Error("Error while adding OTP to the database");
  }
}
