import { gql } from "graphql-request";

export const GET_USER_TEST_VALUE = gql`
  query GET_USER_TEST_VALUE($email: String = "") {
    users_user(where: { email: { _eq: $email } }) {
      id
      isTest
    }
  }
`;
export const GET_USER_OTP = gql`
  query GET_USER_OTP($email: String = "") {
    users_otpToken(
      where: {
        email: { _eq: $email }
        expirationDate: { _gt: "now()" }
        isValid: { _eq: true }
      }
      order_by: { created_at: desc }
    ) {
      emailToken
      isValid
      expirationDate
    }
  }
`;
export const GET_USER_DETAILS = gql`
  query GET_USER_DETAILS($email: String = "") {
    users_user(where: { email: { _eq: $email } }) {
      id
      isTest
      isSignUpCompleted
      isBanned
    }
  }
`;
