import { prisma, Restaurant, User, UserRole } from "@prisma/client"
import { Resolvers, AscendingOrDescending, OrderByField } from "./types"
import { ApolloContext } from "../types"
import { IResolvers, UserInputError } from "apollo-server"
import getUserIdAndRole from "../../utils/getUserIdAndRole"

const resolvers: Resolvers<ApolloContext> = {
  // if I had time I'd refacter "featured_review" into Restaurant
  RestaurantData: {
    featured_review: async ({ restaurant: parent }, args, { prisma }, info) => {
      let restaurant = await prisma.restaurant.findUnique({
        where: {
          id: parent?.id
        },
        include: {
          reviews: {
            include: {
              comment: true,
              rating: true,
              user: true
            },
            where: {
              NOT: [{ comment: null }],
              AND: {
                NOT: [{ rating: null }]
              }
            },
            take: 1,
            orderBy: {
              rating: {
                stars: "asc"
              }
            }
          }
        }
      })

      let { reviews } = restaurant!

      return reviews[0] || 0
    }
  },
  Restaurant: {
    owner(parent, args, { prisma }, info) {
      return prisma.user.findUnique({
        where: {
          id: parent.owner_id
        },
        include: {
          restaurants: true
        }
      })
    },
    num_of_reviews: async (parent, args, { prisma }, info) => {
      let restaurant = await prisma.restaurant.findUnique({
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

      return restaurant!._count?.reviews || 0
    }
  },
  Query: {
    getRestaurantCount: async (parent, data, { prisma }, info) => {
      return await prisma.restaurant.count()
    },
    getRestaurant: async (parent, { id }, { prisma, req }, info) => {
      const { userId } = getUserIdAndRole(req) // open to all logged in users, but throws error if not logged in

      let restaurant: Restaurant | null

      try {
        restaurant = await prisma.restaurant.findUnique({
          where: {
            id
          },
          include: {
            reviews: {
              include: {
                comment: {
                  include: {
                    reply: true
                  }
                },
                rating: true,
                user: true
              }
            }
          }
        })
      } catch (e) {
        throw new Error(
          `Something went wrong trying to find the restaurant with id: ${id}`
        )
      }

      if (!restaurant) {
        throw new Error(`Restaurant with id: ${id} not found!`)
      }

      return {
        restaurant: restaurant
      }
    },
    getRestaurantsByOwner: async (
      parent,
      { ownerId },
      { prisma, req },
      info
    ) => {
      const { userId } = getUserIdAndRole(req) // open to all logged in users, but throws error if not logged in

      try {
        let [count, restaurants] = await prisma.$transaction([
          prisma.restaurant.count(), // undecided on best way to do this
          prisma.restaurant.findMany({
            orderBy: {
              average_rating: "desc"
            },
            include: {
              reviews: {
                include: {
                  comment: {
                    include: {
                      reply: true
                    }
                  },
                  rating: true,
                  user: true
                },
                orderBy: {
                  rating: {
                    stars: "asc"
                  }
                }
              },
              _count: {
                select: {
                  reviews: true // using 'new' preview feature .. selectRelationCount
                }
              }
            },
            where: {
              owner_id: ownerId
            }
          })
        ])

        let returnedRestaurantData = restaurants.map((restaurant) => {
          // featured review is the highest rated with both a rating and a commnet
          let { reviews } = restaurant
          //let featured_review: Review

          const [featured_review] = reviews
            .filter((review) => {
              return review.rating && review.comment
            })
            .sort((a, b) => (a.rating! > b.rating! ? 1 : -1))

          const reviews_pending_reply = reviews.filter((review) => {
            return review.comment && !review.comment.reply
          }).length

          return {
            featured_review,
            reviews_pending_reply,
            restaurant: {
              num_of_reviews: restaurant._count?.reviews,
              ...restaurant
            }
          }
        })

        return returnedRestaurantData
      } catch {
        throw new Error(
          `Something went wrong trying to retrieve restaurants from owner ${ownerId}`
        )
      }
    },
    getRestaurants: async (parent, { data }, { prisma, req }, info) => {
      const { userId } = getUserIdAndRole(req) // open to all logged in users, but throws error if not logged in

      let { orderBy: orderByField, direction, page, recordsPerPage } = data

      let orderByClause: { [field: string]: AscendingOrDescending }[] = [
        {
          [orderByField!]: direction!
        }
      ]

      if (page < 0) {
        page = 0
      }

      try {
        // hmm.. wonder if some type of aggrigation table would be more performant. idk
        let [count, restaurants] = await prisma.$transaction([
          prisma.restaurant.count(), // undecided on best way to do this .. probably a 2nd query to get this seperate would be better
          prisma.restaurant.findMany({
            orderBy: orderByClause,
            take: recordsPerPage,
            skip: recordsPerPage * page,
            include: {
              reviews: {
                include: {
                  comment: true,
                  rating: true,
                  user: true
                },
                where: {
                  NOT: [{ comment: null }],
                  AND: {
                    NOT: [{ rating: null }]
                  }
                },
                take: 1,
                orderBy: {
                  rating: {
                    stars: "asc"
                  }
                }
              },
              _count: {
                select: {
                  reviews: true // interesting 'new' feature of prisma.. selectRelationCount. Perhaps could have used this to get "num_of_ratings"
                }
              }
            }
          })
        ])

        // with (eventual) pagniation, only returning a small number at a time so I'm ok with a map here
        return {
          count,
          restaurants: restaurants.map((restaurant) => {
            return {
              restaurant: {
                num_of_reviews: restaurant._count?.reviews,
                ...restaurant
              },
              featured_review: restaurant.reviews.length
                ? restaurant.reviews[0]
                : undefined
            }
          })
        }
      } catch {
        throw new Error(`Something went wrong trying to retrieve restaurants`)
      }
    }
  },
  Mutation: {
    createRestaurant: async (parent, { data }, { prisma, req }, info) => {
      let restaurant: Restaurant

      try {
        restaurant = await prisma.restaurant.create({
          data
        })
      } catch (e) {
        throw new Error("Something went wrong creating the restaurant")
      }

      return restaurant
    },
    updateRestaurant: async (parent, { id, data }, { prisma, req }, info) => {
      const { userId, role } = getUserIdAndRole(req)

      let restaurant: Restaurant | null

      try {
        restaurant = await prisma.restaurant.findUnique({
          where: {
            id
          }
        })
      } catch (e) {
        throw new Error(
          `Something went wrong finding the restaurant with id ${id}`
        )
      }

      if (!restaurant) {
        throw new Error(`Restaurant with id ${id} not found`)
      }

      if (role !== "ADMIN" || userId !== restaurant.owner_id) {
        throw new Error(`User does not have permission to update this review`)
      }

      try {
        restaurant = await prisma.restaurant.update({
          where: {
            id
          },
          data
        })
      } catch (e) {
        throw new Error("Something went wrong creating the restaurant")
      }

      return restaurant
    },
    deleteRestaurant: async (parent, { id }, { prisma, req }, info) => {
      const { userId, role } = getUserIdAndRole(req)

      let restaurant: Restaurant | null

      try {
        restaurant = await prisma.restaurant.findUnique({
          where: {
            id
          }
        })
      } catch (e) {
        throw new Error(
          `Something went wrong finding the restaurant with id ${id}`
        )
      }

      if (!restaurant) {
        throw new Error(`Restaurant with id ${id} not found`)
      }

      if (role !== "ADMIN" || userId !== restaurant.owner_id) {
        throw new Error(`User does not have permission to update this review`)
      }

      try {
        restaurant = await prisma.restaurant.delete({
          where: {
            id
          }
        })
      } catch (e) {
        throw new Error("Something went wrong deleting the restaurant")
      }

      return restaurant
    }
  }
}

export default resolvers as IResolvers
