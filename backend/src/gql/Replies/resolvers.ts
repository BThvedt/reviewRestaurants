import { Resolvers } from "./types"
import { ApolloContext } from "../types"
import { IResolvers } from "apollo-server"
import { Prisma, prisma, Reply, Restaurant } from "@prisma/client"
import { parentPort } from "worker_threads"
import getUserIdAndRole from "../../utils/getUserIdAndRole"

const resolvers: Resolvers<ApolloContext> = {
  Reply: {
    user(parent, args, { prisma }, info) {
      return prisma.user.findUnique({
        where: {
          id: parent.user_id
        }
      })
    },
    comment(parent, args, { prisma }, info) {
      return prisma.comment.findUnique({
        where: {
          id: parent.comment_id
        }
      })
    },
    review: async (parent, args, { prisma }, info) => {
      let commentData = await prisma.comment.findUnique({
        where: {
          id: parent.comment_id
        },
        include: {
          review: true
        }
      })

      let { review } = commentData!

      return review
    },
    restaurant: async (parent, args, { prisma }, info) => {
      let commentData = await prisma.comment.findUnique({
        where: {
          id: parent.comment_id
        },
        include: {
          review: {
            include: {
              restaurant: true
            }
          }
        }
      })

      let {
        review: { restaurant }
      } = commentData!

      return restaurant
    }
  },
  Query: {
    getReply: async (parent, { id }, { prisma }, info) => {
      let reply: Reply | null

      try {
        reply = await prisma.reply.findUnique({
          where: {
            id
          }
        })
      } catch (e) {
        throw new Error(`Something went wrong finding reply with id ${id}`)
      }

      if (!reply) {
        throw new Error(`Reply with id ${id} not found`)
      }

      return reply
    },
    getRepliesByUser: async (parent, { userId }, { prisma }, info) => {
      let replies: Reply[]

      try {
        replies = await prisma.reply.findMany({
          where: {
            user_id: userId
          }
        })
      } catch (e) {
        throw new Error(
          `Something went wrong finding replies for user with id ${userId}`
        )
      }

      return replies
    },
    getRepliesByResturant: async (
      parent,
      { restaurantId },
      { prisma },
      info
    ) => {
      let replies: Reply[]

      try {
        replies = await prisma.reply.findMany({
          where: {
            comment: {
              review: {
                restaurant_id: restaurantId
              }
            }
          }
        })
      } catch (e) {
        throw new Error(
          `Something went wrong finding replies for restaurants with id ${restaurantId}`
        )
      }

      return replies
    },
    getReplies: async (parent, args, { prisma }, info) => {
      let replies: Reply[]

      try {
        replies = await prisma.reply.findMany()
      } catch (e) {
        throw new Error(`Something went wrong finding replies`)
      }

      return replies
    }
  },
  Mutation: {
    createReply: async (parent, { data }, { prisma, req }, info) => {
      const { userId, role } = getUserIdAndRole(req)

      let {  text, comment_id } = data

      let reply: Reply
      let restaurant: Restaurant

      try {
        let commentData = await prisma.comment.findUnique({
          where: {
            id: comment_id
          },
          include: {
            review: {
              include: {
                restaurant: true
              }
            }
          }
        })

        const { review } = commentData!

        restaurant = review.restaurant
      } catch {
        throw new Error(
          `Something went wrong finding the data of the comment with id ${comment_id}`
        )
      }

      if (userId !== restaurant.owner_id) {
        throw new Error(
          `User does not have permission to reply to this comment!`
        )
      }

      try {
        reply = await prisma.reply.create({
          data: {
            user_id: userId,
            ...data
          }
        })
      } catch (e) {
        throw new Error(`Something went wrong creating a reply`)
      }

      return reply
    },
    updateReply: async (parent, { id, text }, { prisma, req }, info) => {
      const { userId, role } = getUserIdAndRole(req)

      let reply: Reply | null

      try {
        reply = await prisma.reply.findUnique({
          where: {
            id
          }
        })
      } catch (e) {
        throw new Error(`Something went wrong finding the reply with id ${id}`)
      }

      if (!reply) {
        throw new Error(`Reply with id ${id} not found`)
      }

      if (role !== "ADMIN" && reply.user_id !== userId) {
        throw new Error(`User does not have permission to update this reply!`)
      }

      try {
        reply = await prisma.reply.update({
          where: {
            id
          },
          data: {
            text
          }
        })
      } catch (e) {
        throw new Error(`Something went wrong updating the reply with id ${id}`)
      }

      return reply
    },
    deleteReply: async (parent, { id }, { prisma, req }, info) => {
      const { userId, role } = getUserIdAndRole(req)
      let reply: Reply | null

      console.log('I AM HERE')

      try {
        reply = await prisma.reply.findUnique({
          where: {
            id
          }
        })
      } catch (e) {
        throw new Error(`Something went wrong finding the reply with id ${id}`)
      }

      if (!reply) {
        throw new Error(`Reply with id ${id} not found`)
      }

      if (role !== "ADMIN" && reply.user_id !== userId) {
        throw new Error(`User does not have permission to delete this reply!`)
      }

      console.log('I AM HERE')

      try {
        reply = await prisma.reply.delete({
          where: {
            id
          }
        })
      } catch (e) {
        throw new Error(`Something went wrong updating the reply with id ${id}`)
      }

      return reply
    }
  }
}

export default resolvers as IResolvers
