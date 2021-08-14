import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { TypedTypePolicies } from "../generated/graphql-typepolicies"
import { setContext } from "apollo-link-context"

const credentials = "include"

const typePolicies: TypedTypePolicies = {
  User: {
    keyFields: ["id"]
  }
}

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_ENDPOINT,
  credentials
})

let finatlHttpeLink

if (process.env.REACT_APP_AUTH_METHOD === "Token") {
  const authLink = setContext(
    (_, { headers }: { headers: Record<string, unknown> }) => {
      const token = localStorage.getItem("token")

      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ""
        }
      }
    }
  )
  finatlHttpeLink = authLink.concat(httpLink as any) as any // I think this might be an error with apollo-whatever, just throw 'any' on anything, I guess
} else {
  finatlHttpeLink = httpLink
}

export const client = new ApolloClient({
  link: finatlHttpeLink,
  cache: new InMemoryCache({ typePolicies })
})
