import { gql } from "graphql-request";

export const GET_USER_TEST_VALUE = gql`
  query GET_USER_TEST_VALUE($email: String = "") {
    users_user(where: { email: { _eq: $email } }) {
      id
      isTest
    }
  }
`;
