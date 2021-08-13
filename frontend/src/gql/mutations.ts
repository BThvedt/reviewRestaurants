import { gql } from "@apollo/client"

export const LOGIN = gql`
  mutation login($data: LoginUserInput!) {
    login(data: $data) {
      ... on TokenPayload {
        token
        user {
          id
          name
          email
          role
        }
      }
      ... on User {
        id
        name
        email
        role
      }
    }
  }
`

export const LOGOUT = gql`
  mutation {
    logout
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $data: UpdateUserInput!) {
    updateUser(id: $id, data: $data) {
      id
      name
      email
    }
  }
`
