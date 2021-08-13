import { Resolvers } from "./types"
import { ApolloContext } from "../types"
import { IResolvers } from "apollo-server"
import { Review } from "@prisma/client"
import { CommentInput, RatingInput, AscendingOrDescending } from "./types"
import getUserIdAndRole from "../../utils/getUserIdAndRole"

// a review must have either a comment, a rating, or both, and the stars should only have certian values
const validateReview = (
  comment?: CommentInput | null,
  rating?: RatingInput | null
) => {
  if (!comment && !rating) {
    throw new Error("A review needs to have either a comment or a rating")
  }

  if (
    rating?.stars &&
    (rating.stars < 0 ||
      rating.stars > 5 ||
      parseFloat((rating.stars % 0.5).toFixed(1)) !== 0)
  ) {
    throw new Error(
      "Stars must be between 0 and 5 and increment in steps of .5"
    )
  }
}

const getReviewClauses = (
  comment?: CommentInput | null,
  rating?: RatingInput | null
) => {
  return {
    commentClause: comment
      ? {
          create: {
            ...comment
          }
        }
      : undefined,

    ratingClause: rating
      ? {
          create: {
            stars: parseFloat(rating.stars.toFixed(1))
          }
        }
      : undefined
  }
}

const resolvers: Resolvers<ApolloContext> = {
  Review: {
    user(parent, args, { prisma }, info) {
      return prisma.user.findUnique({
        where: {
          id: parent.user_id
        }
      })
    },
    restaurant(parent, args, { prisma }, info) {
      return prisma.restaurant.findUnique({
        where: {
          id: parent.restaurant_id
        }
      })
    }
  },
  Query: {
    getReview: async (parent, { id }, { prisma, req }, info) => {
      let review: Review | null

      try {
        review = await prisma.review.findUnique({
          where: {
            id
          },
          include: {
            rating: true,
            comment: true
          }
        })
      } catch (e) {
        throw new Error(`Something went wrong getting the review with id ${id}`)
      }

      if (!review) {
        throw new Error(`Review with id ${id} does not exist`)
      }

      return review
    },
    getReviews: async (parent, { data }, { prisma, req }, info) => {
      const { userId } = getUserIdAndRole(req) // open to all logged in users, but throws error if not logged in

      let { page, recordsPerPage } = data

      if (page < 0) {
        page = 0
      }

      try {
        let [count, reviews] = await prisma.$transaction([
          prisma.review.count(), // undecided on best way to do this .. probably a 2nd query to get this seperate would be better
          prisma.review.findMany({
            take: recordsPerPage,
            skip: recordsPerPage * page,
            include: {
              rating: true,
              comment: {
                include: {
                  reply: true
                }
              }
            }
          })
        ])

        return {
          reviews,
          count
        }
      } catch (e) {
        throw new Error(`Something went wrong getting reviews`)
      }
    },
    getReviewCount: async (parent, args, { prisma }, info) => {
      return prisma.review.count()
    },
    getReviewsByUser: async (parent, { userId }, { prisma }, info) => {
      let reviews: Review[]

      try {
        reviews = await prisma.review.findMany({
          where: {
            user_id: userId
          },
          include: {
            rating: true,
            comment: {
              include: {
                reply: true
              }
            }
          }
        })
      } catch (e) {
        throw new Error(
          `Something went wrong getting reviews for user wtih id ${userId}`
        )
      }

      return reviews
    },
    getReviewsByRestaurant: async (
      parent,
      { restaurantId },
      { prisma },
      info
    ) => {
      let reviews: Review[]

      try {
        reviews = await prisma.review.findMany({
          where: {
            restaurant_id: restaurantId
          },
          include: {
            rating: true,
            comment: true
          }
        })
      } catch (e) {
        throw new Error(
          `Something went wrong getting reviews for restaurant wtih id ${restaurantId}`
        )
      }

      return reviews
    }
  },
  Mutation: {
    createReview: async (parent, { data }, { prisma, req }, info) => {
      const { userId } = getUserIdAndRole(req)

      let { visited, restaurant_id, comment, rating } = data

      validateReview(comment, rating)

      let review: Review

      let { commentClause, ratingClause } = getReviewClauses(comment, rating)

      try {
        review = await prisma.review.create({
          data: {
            visited,
            user_id: userId,
            restaurant_id,
            comment: commentClause,
            rating: ratingClause
          }
        })
      } catch (e) {
        throw new Error("Something went wrong creating the review")
      }

      // now time to update the restaurant. Might as well grab the count too
      try {
        let { _avg, _count } = await prisma.rating.aggregate({
          _avg: {
            stars: true
          },
          _count: {
            stars: true
          },
          where: {
            review: {
              restaurant_id
            }
          }
        })

        await prisma.restaurant.update({
          where: {
            id: restaurant_id
          },
          data: {
            average_rating: _avg.stars || 0,
            num_of_ratings: _count.stars || 0
          }
        })
      } catch {
        throw new Error("Something went wrong updating review averages")
      }

      return review
    },
    updateReview: async (parent, { id, data }, { prisma, req }, info) => {
      const { userId, role } = getUserIdAndRole(req)

      let { visited, restaurant_id, comment, rating } = data

      validateReview(comment, rating)

      let review: Review | null

      try {
        review = await prisma.review.findUnique({
          where: {
            id
          }
        })
      } catch (e) {
        throw new Error(`Something went wrong finding the review with id ${id}`)
      }

      if (!review) {
        throw new Error(`Review with id ${id} not found`)
      }

      if (role !== "ADMIN" || userId !== review.user_id) {
        throw new Error(`User does not have permission to update this review`)
      }

      let { commentClause, ratingClause } = getReviewClauses(comment, rating)

      try {
        review = await prisma.review.update({
          where: {
            id
          },
          data: {
            visited,
            user_id: userId,
            restaurant_id,
            comment: commentClause,
            rating: ratingClause
          }
        })
      } catch (e) {
        throw new Error("Something went wrong updating the review")
      }

      // now time to update the restaurant
      try {
        let reviewAverages = await prisma.rating.aggregate({
          _avg: {
            stars: true
          },
          _count: {
            stars: true
          },
          where: {
            review: {
              restaurant_id
            }
          }
        })

        let { _avg, _count } = reviewAverages

        await prisma.restaurant.update({
          where: {
            id: restaurant_id
          },
          data: {
            average_rating: _avg.stars || 0,
            num_of_ratings: _count.stars || 0
          }
        })
      } catch {
        throw new Error("Something went wrong updating review averages")
      }

      return review
    },
    deleteReview: async (parent, { id }, { prisma, req }, info) => {
      const { userId, role } = getUserIdAndRole(req)

      let review: Review | null

      try {
        review = await prisma.review.findUnique({
          where: {
            id
          }
        })
      } catch (e) {
        throw new Error(`Something went wrong finding the review with id ${id}`)
      }

      if (!review) {
        throw new Error(`Review with id ${id} not found`)
      }

      if (role !== "ADMIN" || userId !== review.user_id) {
        throw new Error(`User does not have permission to delete this review`)
      }

      try {
        await prisma.review.delete({
          where: {
            id
          }
        })
      } catch (e) {
        throw new Error("Something went wrong updating the review")
      }

      return review
    }
  }
}

export default resolvers as IResolvers
