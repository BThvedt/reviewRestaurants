import { PrismaClient, UserRole } from "@prisma/client"
const prisma = new PrismaClient()
import bcrypt from "bcryptjs"
import {
  nameEmailRoleArray,
  getRandomRestaurantName,
  generateRandomStarRating
} from "./seedHelperData"
import faker from "faker"

// Docs:
// https://www.prisma.io/docs/guides/application-lifecycle/seed-database

// Issue with windows with new versions of prisma
// https://github.com/prisma/prisma/issues/7176

const hashPassword = (password: string) => {
  if (password.length < 8) {
    throw new Error("Password must be 8 characters or longer")
  }

  return bcrypt.hash(password, 10)
}

async function main() {
  let password = await hashPassword("password")

  // first create a couple users with easy names and passwords to remember
  // names: "admin, owner, user", roles: "ADMIN, OWNER, USER", email: "admin@email, owner@email, user@email", password: "password"
  await prisma.$transaction(
    nameEmailRoleArray.map((entry: any) =>
      prisma.user.upsert({
        where: { email: entry.email },
        update: {},
        create: {
          email: entry.email,
          name: entry.name,
          password,
          role: entry.role as UserRole
        }
      })
    )
  )

  console.log("Initial users created")

  // create like 5 other admins, maybe ~ 100 owners, and 500(ish) users. They all have the password 'password'
  let userDataArray = []
  var role: string
  for (var i = 0; i < 600; i++) {
    i < 5
      ? (role = "ADMIN")
      : i < 105
      ? (role = "RESTAURANT_OWNER")
      : (role = "REGULAR")
    userDataArray[i] = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      role
    }
  }

  await prisma.$transaction(
    userDataArray.map((entry) =>
      prisma.user.upsert({
        where: { email: entry.email },
        update: {},
        create: {
          email: entry.email,
          name: entry.name,
          password,
          role: entry.role as UserRole
        }
      })
    )
  )

  console.log("More users created")

  // Now we have newly created owners, and can use their Id's to make other stuff
  let owners = await prisma.user.findMany({
    where: {
      role: "RESTAURANT_OWNER"
    }
  })

  // create between 0 and 10 restaurants per owner
  let restaurantDataArray: { name: string; owner_id: string }[] = []

  // faker doesn't have a restaurant name generator so I made up my own one
  // probably had too much fun with this, for an actual client I would dial it back a little
  // it's not perfect but good enough!
  owners.forEach((owner, i) => {
    let numOfRestaurants = Math.floor(Math.random() * 10)
    let firstName = owner.name.split(" ")[0]
    for (var i = 0; i < numOfRestaurants; i++) {
      restaurantDataArray.push({
        name: getRandomRestaurantName(firstName),
        owner_id: owner.id
      })
    }
  })

  // need a unique index for upserts. hmm .. maybe make the owner_id and name unique
  // in real life there would probalby be like a location or something I could use instead for unique index
  // should be extremely rare for these created restaruants to have same name. Upsert will silently fail in that case
  await prisma.$transaction(
    restaurantDataArray.map((entry) =>
      prisma.restaurant.upsert({
        where: {
          owner_id_and_name: { owner_id: entry.owner_id, name: entry.name }
        },
        update: {},
        create: {
          owner_id: entry.owner_id,
          name: entry.name
        }
      })
    )
  )

  console.log("Restaurants created")

  // get the restaurants and make a new data array, and then do the same for all non-admin users
  // make 0 - 15 reviews per user, for random restaurants
  let restaurants = await prisma.restaurant.findMany()
  let nonAdmins = await prisma.user.findMany({
    where: {
      role: {
        not: "ADMIN"
      }
    }
  })

  let numOfReviews: number
  const numOfRestaurants = restaurants.length
  let randRestaurantIndex: number
  let reviewedRestaruantIndexes: number[] = []
  let commentClause: any
  let ratingClause: any

  let reviewArray: {
    visited: Date // example output: 2016-07-16T20:24:30.655Z
    user_id: string
    restaurant_id: string
    comment: any
    rating: any
  }[] = []

  nonAdmins.forEach((user) => {
    numOfReviews = Math.floor(Math.random() * 15)
    reviewedRestaruantIndexes = []
    for (var i = 0; i < numOfReviews; i++) {
      randRestaurantIndex = Math.floor(Math.random() * numOfRestaurants)

      // only do a review if hasn't been done before or it will violate a unique constraint
      if (!reviewedRestaruantIndexes.includes(randRestaurantIndex)) {
        reviewedRestaruantIndexes.push(randRestaurantIndex)

        let restaurant = restaurants[randRestaurantIndex]

        // owners can't review their own restaurants!
        if (restaurant.owner_id !== user.id) {
          commentClause = {
            create: {
              title: faker.lorem.sentence(),
              text: faker.lorem.paragraph()
            }
          }

          ratingClause = {
            create: {
              stars: generateRandomStarRating()
            }
          }

          // 33% of reviews will have a rating and comment, 33% just a rating, and 33% just a comment
          let randChance = Math.floor(Math.random() * 3)
          if (randChance < 1) {
            commentClause = undefined
          } else if (randChance < 2) {
            ratingClause = undefined
          }

          reviewArray.push({
            visited: faker.date.between("01/01/2016", new Date()), // example output: 2016-07-16T20:24:30.655Z
            user_id: user.id,
            restaurant_id: restaurant.id,
            comment: commentClause,
            rating: ratingClause
          })
        }
      }
    }
  })

  await prisma.$transaction(
    reviewArray.map((entry) =>
      prisma.review.upsert({
        where: {
          user_and_restaurant_id: {
            user_id: entry.user_id,
            restaurant_id: entry.restaurant_id
          }
        },
        update: {},
        create: {
          ...entry
        }
      })
    )
  )

  console.log("reviews created")

  // for each comment, leave a 33% chance the owner will reply
  let reviewArr = await prisma.review.findMany({
    include: {
      comment: true, // might not have a comment
      restaurant: true // they all should have a "restaurant"
    }
  })

  let reviewsWithComments = reviewArr.filter((review) => review.comment)

  let replyArr: {
    title: string
    text: string
    user_id: string
    comment_id: string
  }[] = []
  let randReplyChance: number

  reviewsWithComments.forEach((review) => {
    randReplyChance = Math.floor(Math.random() * 3)
    if (randReplyChance < 1) {
      let { comment, restaurant } = review

      replyArr.push({
        title: faker.lorem.sentence(),
        text: faker.lorem.paragraphs(),
        user_id: restaurant.owner_id,
        comment_id: comment!.id
      })
    }
  })

  await prisma.$transaction(
    replyArr.map((entry) =>
      prisma.reply.upsert({
        where: { comment_id: entry.comment_id },
        update: {},
        create: {
          ...entry
        }
      })
    )
  )

  console.log("replies created")

  // then finally, for each restaruant, populate average rating and number of reviews
  // this is probably the biggest query of them all ...

  let restaurantIdsAndAverages: {
    id: string
    stars: number | null
    count: number | null
  }[] = []

  let asdfArray: string[] = []

  //console.log(restaurants)

  // remember. .. foreach loops don't work.. just use a promise.all
  await Promise.all(
    restaurants.map(async (restaurant) => {
      const {
        _avg: { stars },
        _count: { stars: count }
      } = await prisma.rating.aggregate({
        _avg: {
          stars: true
        },
        _count: {
          stars: true
        },
        where: {
          review: {
            restaurant_id: restaurant.id
          }
        }
      })

      restaurantIdsAndAverages.push({
        id: restaurant.id,
        stars,
        count
      })
    })
  )

  console.log("averages calculated")

  // aggraate the averages into an array
  // do a $transaction for the final restaurant update ..

  await prisma.$transaction(
    restaurantIdsAndAverages.map((idAndAvg) =>
      prisma.restaurant.update({
        where: { id: idAndAvg.id },
        data: {
          average_rating: idAndAvg.stars || 0,
          num_of_ratings: idAndAvg.count || 0
        }
      })
    )
  )

  // .. done ..

  console.log("restaurant ratings updated!")

  // prisma will give a success message even if it fails in some cases so this is to confirm
  console.log("Database seed successfull!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
