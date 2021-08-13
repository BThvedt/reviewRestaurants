import { typeDefs as rootDefs, resolvers as rootResolvers } from "./root"
import { typeDefs as userTypeDefs, resolvers as userResolvers } from "./Users"
import {
  typeDefs as restaurantTypeDefs,
  resolvers as restaurantResolvers
} from "./Restaurants"
import {
  typeDefs as reviewTypeDefs,
  resolvers as reviewResolvers
} from "./ReviewsRatingsAndComments"
import {
  typeDefs as replyTypeDefs,
  resolvers as replyResolvers
} from "./Replies"

const typeDefs = [
  rootDefs,
  userTypeDefs,
  restaurantTypeDefs,
  reviewTypeDefs,
  replyTypeDefs
]
const resolvers = [
  rootResolvers,
  userResolvers,
  restaurantResolvers,
  reviewResolvers,
  replyResolvers
]

export { typeDefs, resolvers }
