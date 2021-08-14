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

export const CREATE_REPLY = gql`
  mutation CreateReply($data: ReplyInput!) {
    createReply(data: $data) {
      id
      text
    }
  }
`

export const UPDATE_REPLY = gql`
  mutation UpdateReply($id: ID!, $text: String!) {
    updateReply(id: $id, text: $text) {
      id
      text
    }
  }
`

export const DELETE_REPLY = gql`
  mutation DeleteReply($id: ID!) {
    deleteReply(id: $id) {
      id
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`

export const DELETE_RESTAURANT = gql`
  mutation DeleteUser($id: ID!) {
    deleteRestaurant(id: $id) {
      id
    }
  }
`

export const UPDATE_RESTAURANT = gql`
  mutation UpdateRestaurant($id: ID!, $data: RestaurantInput!) {
    updateRestaurant(id: $id, data: $data) {
      id
    }
  }
`
