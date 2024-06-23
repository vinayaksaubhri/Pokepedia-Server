import { client } from "../graphql";
import { GET_USER_TEST_VALUE } from "../graphql/queries";

export async function getIsTestUsers(userDetails: {
  email: string;
}): Promise<boolean> {
  const result = await client.request(GET_USER_TEST_VALUE, {
    email: userDetails.email,
  });
  const isTest: boolean = result.users_user?.[0]?.isTest;

  return isTest || false;
}
