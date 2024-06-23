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
export const CREATE_NEW_USER = gql`
  mutation CREATE_NEW_USER($email: String = "") {
    insert_users_user(objects: { email: $email }) {
      returning {
        id
        isBanned
        isSignUpCompleted
        isTest
      }
    }
  }
`;
export const RESET_OTP_IS_VALID = gql`
  mutation RESET_OTP_IS_VALID($email: String = "") {
    update_users_otpToken_many(
      updates: {
        where: { email: { _eq: $email }, isValid: { _eq: true } }
        _set: { isValid: false }
      }
    ) {
      affected_rows
    }
  }
`;
