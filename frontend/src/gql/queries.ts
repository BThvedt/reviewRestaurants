import { gql } from "@apollo/client"

export const GET_COUNTS = gql`
  query GetCounts {
    getRestaurantCount
    getReviewCount
  }
`

export const GET_CURRENT_USER = gql`
  query {
    currentUser {
      id
      name
      email
      role
    }
  }
`

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
    }
  }
`

export const GET_USER_NAME_AND_ROLE = gql`
  query GetUserNameAndRole($id: ID!) {
    getUserNameAndRole(id: $id) {
      name
      role
    }
  }
`

export const GET_REVIEWS = gql`
  query GetReviews($data: getReviewsInput!) {
    getReviews(data: $data) {
      count
      reviews {
        id
        visited
        rating {
          stars
        }
        comment {
          id
          title
          text
          reply {
            text
            user {
              id
              name
            }
          }
        }
        user {
          id
          name
          num_of_reviews
        }
        restaurant {
          id
          name
          num_of_reviews
          num_of_ratings
          average_rating
        }
      }
    }
  }
`

export const GET_REVIEWS_BY_USER = gql`
  query GetReviewsByUser($userId: ID!) {
    getReviewsByUser(userId: $userId) {
      id
      visited
      rating {
        stars
      }
      comment {
        id
        title
        text
        reply {
          text
          user {
            id
            name
          }
        }
      }
      user {
        id
        name
        num_of_reviews
      }
      restaurant {
        id
        name
        num_of_reviews
        num_of_ratings
        average_rating
      }
    }
  }
`

export const GET_RESTAURANTS = gql`
  query GetRestaurants($data: getRestaurantsInput!) {
    getRestaurants(data: $data) {
      count
      restaurants {
        restaurant {
          id
          name
          average_rating
          num_of_ratings
          num_of_reviews
        }
        featured_review {
          id
          rating {
            id
            stars
          }
          comment {
            id
            title
            text
          }
          user {
            id
            name
            num_of_reviews
          }
        }
      }
    }
  }
`

export const GET_RESTAURANTS_BY_OWNER = gql`
  query GetRestaurantsByOwner($ownerId: ID!) {
    getRestaurantsByOwner(ownerId: $ownerId) {
      restaurant {
        id
        name
        num_of_reviews
        num_of_ratings
        average_rating
        reviews {
          rating {
            stars
          }
          comment {
            id
            title
            text
            reply {
              text
            }
          }
        }
      }
      reviews_pending_reply
      featured_review {
        comment {
          title
          text
        }
        rating {
          stars
        }
        user {
          id
          name
          num_of_reviews
        }
      }
    }
  }
`

export const GET_RESTAURANT = gql`
  query GetRestaurant($id: ID!) {
    getRestaurant(id: $id) {
      restaurant {
        id
        name
        average_rating
        num_of_ratings
        num_of_reviews

        owner {
          id
          name
          restaurants {
            name
          }
        }

        reviews {
          id
          visited
          rating {
            stars
          }
          comment {
            id
            title
            text
            reply {
              id
              text
            }
          }
          user {
            id
            name
            num_of_reviews
          }
        }
      }
    }
  }
`

export const GET_USERS = gql`
  query GetUsers($data: GetUsersInput!) {
    getUsers(data: $data) {
      count
      users {
        id
        name
        role
        email
      }
    }
  }
`
