import { GraphQLClient } from "graphql-request";
require("dotenv").config();

if (
  typeof process.env.GRAPHQL_ENDPOINT === "undefined" ||
  typeof process.env.HASURA_ADMIN_SECRET === "undefined"
) {
  throw new Error("HASURA_ADMIN_SECRET or GRAPHQL_ENDPOINT is not defined");
}

export const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT, {
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
  },
});
