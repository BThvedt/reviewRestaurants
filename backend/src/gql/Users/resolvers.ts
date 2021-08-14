import { User } from "@prisma/client"
import { Resolvers } from "./types"
import { ApolloContext } from "../types"
import { IResolvers } from "apollo-server"
import bcrypt from "bcryptjs"
import generateToken from "../../utils/generateToken"
import getUserIdAndRole from "../../utils/getUserIdAndRole"
import hashPassword from "../../utils/hashPassword"

const resolvers: Resolvers<ApolloContext> = {
  User: {
    num_of_reviews: async (parent, args, { prisma }, info) => {
      let user = await prisma.user.findUnique({
        where: {
          id: parent.id
        },
        include: {
          _count: {
            select: {
              reviews: true // using 'new' preview feature .. selectRelationCount
            }
          }
        }
      })

      if (!user?._count) {
        throw new Error(
          "There was a problem getting the number of the users reviews"
        )
      }

      return user._count.reviews
    }
  },
  UserOrTokenPayload: {
    __resolveType: (obj) => {
      if (obj.hasOwnProperty("token")) {
        return "TokenPayload"
      } else {
        return "User"
      }
    }
  },
  Query: {
    // only logged in users can get a jwt with the Id so no permission checks necessary here
    test: async (parent, args, context, info) => {
      return "hello"
    },

    // the query for returning current user info
    currentUser: async (parent, args, { prisma, req }, info) => {
      const { userId } = getUserIdAndRole(req)

      const user = await prisma.user.findUnique({
        where: {
          id: userId
        }
      })
      if (!user) {
        throw new Error(`User with ID ${userId} not found`)
      }

      return user
    },
    // an admin level query that gets the info for any user
    // if not an admin, use 'currentUser' to get current user info
    getUser: async (parent, { id }, { prisma, req }) => {
      const { userId, role } = getUserIdAndRole(req)

      let user: User | null

      try {
        user = await prisma.user.findUnique({
          where: {
            id
          }
        })
      } catch (e) {
        throw new Error("Something went wrong reading the database")
      }

      if (role !== "ADMIN" && userId !== user?.id) {
        throw new Error("Only Admins can query other users data")
      }

      if (!user) {
        throw new Error(`User with ID ${userId} not found`)
      }

      return user
    },
    getUserNameAndRole: async (parent, { id }, { prisma, req }, info) => {
      const { userId } = getUserIdAndRole(req) // open to all registered users, but throws error if unauthenticated

      let user: User | null

      try {
        user = await prisma.user.findUnique({
          where: {
            id
          }
        })
      } catch (e) {
        throw new Error("Something went wrong reading the database")
      }

      if (!user) {
        throw new Error(`User with ID ${userId} not found`)
      }

      let { name, role } = user

      return { name, role }
    },
    getUsers: async (parent: any, {data}, { prisma, req }: any) => {
      const { userId, role } = getUserIdAndRole(req)

      if (role !== "ADMIN") {
        throw new Error("User does not have permissions for this query")
      }

      let {page, recordsPerPage} = data

      let [count, users] = await prisma.$transaction([
        prisma.user.count(),
        prisma.user.findMany({
        take: recordsPerPage,
            skip: recordsPerPage * page,
      }),
      ])

      // const users = await prisma.user.findMany({
      //   take: recordsPerPage,
      //       skip: recordsPerPage * page,
      // })

      return {count, users}
    }
  },
  Mutation: {
    createUser: async (parent, args, { prisma, req }, info) => {
      const { userId, role: userRole } = getUserIdAndRole(req, false)

      // two cases. Either this is an anonomyous signup, or this is being created
      let { name, email, password } = args.data

      // only Admins can create another Admin
      // decided not ot involve role here. I'd handle it some other way but pressed for time
      // if (createdRole === "ADMIN" && userRole !== "ADMIN") {
      //   throw new Error(
      //     "User is unauthenticated or does not have permissions to create this role"
      //   )
      // }

      const hashedPassword = await hashPassword(args.data.password)

      let user: User

      try {
        user = await prisma.user.create({
          data: {
            ...args.data,
            password: hashedPassword
          }
        })
      } catch (e) {
        if (e.message) {
          throw new Error(e.message)
        } else {
          throw new Error("Something went wrong creating the user")
        }
      }

      return user
    },
    updateUser: async (parent, args, { prisma, req }, info) => {
      const { userId, role: userRole } = getUserIdAndRole(req, false)

      // I decided not to handle role logic in this mutation
      // instead, the user will be a 'Restaurant_Owner' if they have restaurants or not
      // see retaurant resolvers for example
      let { idToUpdate, password: newPassword, ...restOfArgs } = args.data

      // users can update themselves
      // only admins can update other users
      if (userId !== idToUpdate && userRole !== "ADMIN") {
        throw new Error("User does not have permissions to update this profile")
      }

      let updatedUser: User | null

      let data: Record<string, unknown> = { ...restOfArgs }

      if (newPassword) {
        data.password = await hashPassword(newPassword)
      }

      try {
        updatedUser = await prisma.user.update({
          where: {
            id: idToUpdate
          },
          data
        })
      } catch (e) {
        throw new Error("Something went wrong updating the user")
      }

      return updatedUser
    },
    deleteUser: async (parent, { id: idToDelete }, { prisma, req }, info) => {
      // users can delete themselves
      // only admins can get delete other users
      const { userId, role: userRole } = getUserIdAndRole(req, false)

      if (userId !== idToDelete && userRole !== "ADMIN") {
        throw new Error("Admin Permission required to delete other users")
      }

      const userToDelete = await prisma.user.findUnique({
        where: {
          id: idToDelete
        }
      })

      if (!userToDelete) {
        throw new Error(`User with ID ${idToDelete} not found`)
      }

      // admins cannot delete other admins. Delete self I guess is allowed
      if (userToDelete.role === "ADMIN" && userId !== idToDelete) {
        throw new Error("Admins cannot delete other Admins")
      }

      let deletedUser: User | null

      try {
        deletedUser = await prisma.user.delete({
          where: {
            id: idToDelete
          }
        })
      } catch {
        throw new Error("Something went wrong deleteing the user")
      }

      if (!deletedUser) {
        throw new Error("Something went wrong deleting the user")
      }

      return deletedUser
    },
    login: async (parent, args, { prisma, req, res }, info) => {
      let user

      try {
        user = await prisma.user.findUnique({
          where: {
            email: args.data.email
          }
        })
      } catch (e) {
        throw new Error(`Could not connect to the database!!`)
      }

      if (!user) {
        throw new Error(`User with email ${args.data.email} not found`)
      }

      const isMatch = await bcrypt.compare(args.data.password, user.password)

      if (!isMatch) {
        throw new Error(`Password does not match`)
      }

      if (process.env.AUTH_METHOD === "Token") {
        return {
          user,
          token: generateToken(user.id, user.role)
        }
      } else {
        req.session = {
          jwt: generateToken(user.id, user.role)
        }
      }

      return user
    },
    logout: async (parent, args, { prisma, req }, info) => {
      if (process.env.AUTH_METHOD === "Cookie") {
        req.session = null
        return true
      }

      return false
    }
  }
}

export default resolvers as IResolvers
