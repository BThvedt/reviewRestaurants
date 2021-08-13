import { PrismaClient } from "@prisma/client"

export interface ApolloContext {
  prisma: PrismaClient
  req: any
  res: any
}
