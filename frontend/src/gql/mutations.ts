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

export const CREATE_RESTAURANT = gql`
  mutation CreateRestaurant($data: RestaurantInput!) {
    createRestaurant(data: $data) {
      id
      name
      owner_id
      owner {
        id
        name
      }
      average_rating
      num_of_ratings
      num_of_reviews
      reviews {
        id
      }
    }
  }
`

export const CREATE_REVIEW = gql`
  mutation CreateReview($data: ReviewInput!) {
    createReview(data: $data) {
      user_id
      restaurant {
        id
        name
      }
      user {
        id
        name
      }
    }
  }
`
