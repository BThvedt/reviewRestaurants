import { gql } from "apollo-server"
import { readFileSync } from "fs"
import { join } from "path"

const typeDefinitions = readFileSync(
  join(__dirname, "./schema.graphql"),
  "utf8"
)

const typeDefs = gql`
  ${typeDefinitions}
`

export { typeDefs }
export { default as resolvers } from "./resolvers"
