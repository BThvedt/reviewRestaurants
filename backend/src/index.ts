import prisma from "./prisma"
import { ApolloServer, gql } from "apollo-server-express"
import express from "express"
import cookieSession from "cookie-session"
import cors from "cors"
import { typeDefs, resolvers } from "./gql"

let whitelist = ["http://localhost:5000", "http://localhost:3000"]

const app = express()

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || typeof origin === "undefined") {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true // <-- don't forget this!
}
app.use(cors(corsOptions))

app.use(
  cookieSession({
    name: "reviewRestaurants",
    signed: false,
    httpOnly: true,
    secure: false
  })
)

const start = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context({ req, res }) {
      return {
        prisma,
        req,
        res
      }
    }
  })

  server.applyMiddleware({
    app,
    cors: false, // if this isn't 'false' it overrides corsoptins
    path: "/"
  })

  app.listen({ port: 5000 }, () => {
    console.log(`🚀 Server ready at http://localhost:5000`)
  })
}

start()
