import { gql } from "graphql-request";

export const INSERT_OTP = gql`
  mutation INSERT_OTP($email: String = "", $emailToken: String = "") {
    insert_users_otpToken_one(
      object: { email: $email, emailToken: $emailToken }
    ) {
      id
    }
  }
`;
