// import { PrismaClient } from "@prisma/client"
import { IResolvers } from "apollo-server"
import { Resolvers } from "./types"
import { PrismaClient } from "@prisma/client"
import { DateTimeResolver } from "graphql-scalars"

interface ApolloContext {
  prisma: PrismaClient
}

//const resolvers: IResolvers<any, ApolloContext> = {
const resolvers: Resolvers<ApolloContext> = {
  DateTime: DateTimeResolver,
  Query: {
    root: (parent, args, context, info) => "root Query"
  },
  Mutation: {
    root: (parent, args, context, info) => "root mutation"
  }
}

// a workaround for apollo weirdness??
export default resolvers as IResolvers
