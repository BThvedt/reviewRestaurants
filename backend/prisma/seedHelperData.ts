const optionalDescriptor = [
  "Taste of",
  "Crispy",
  "Fine",
  "Fast",
  "Casual",
  "Heavenly",
  "Spectacular",
  "Touch of",
  "Tasty",
  "Yummy",
  "Delicious",
  "Frantic",
  "Blissful",
  "Lovely",
  "Delectable",
  "Fantastic",
  "Unreal",
  "Pretty Good",
  "Supreme",
  "Crusty",
  "Nice",
  "Proper",
  "Divine",
  "Out of this World",
  "Off the hook",
  "Radical",
  "Insane",
  "Crazy",
  "Apocalyptic",
  "Ridiculous",
  "Juicy",
  "Spicy",
  "Hot",
  "Ludacris",
  "Zesty"
]
const restaurantType = [
  "Chicken",
  "Beef",
  "Potato",
  "Pork",
  "Fish",
  "Vegetable",
  "Noodle",
  "Vegan",
  "Coffee",
  "Pizza",
  "Lobster",
  "Sandwich",
  "Wings",
  "Fried Chicken",
  "Soup",
  "Salad",
  "Sushi",
  "Burger",
  "Grilled Cheese",
  "Herb",
  "Vegetarian",
  "Taco",
  "Burrito",
  "Pretzel",
  "Hot Dog",
  "Steak",
  "Seafood",
  "Soul Food",
  "Barbecue",
  "BBQ",
  "Wrap",
  "Bagel",
  "Pasta",
  "Toast",
  "Tapas",
  "Roll",
  "Breakfast",
  "Lunch",
  "Dinner",
  "American",
  "Mexican",
  "Chinese",
  "Italian",
  "Asian Fusion",
  "Greek",
  "Vietnamese",
  "Native American",
  "Ethopian",
  "Szechwan",
  "Hawaiian",
  "French",
  "German",
  "English",
  "Irish",
  "Spanish",
  "Japanese",
  "Cajun",
  "Scandinavian",
  "Thai",
  "Tex-Mex",
  "Ethopian",
  "Egyptian",
  "Belgian",
  "Greasy Spoon",
  "Hashery"
]
const restaurantTypePartTwo = [
  "Food",
  "Diner",
  "House",
  "Barn",
  "Buffet",
  "Galore",
  "Stand",
  "Fiesta",
  "Bucket",
  "Feast",
  "Emporium",
  "Ranch",
  "Carte",
  "Bash",
  "Gourmet",
  "Extravaganza",
  "Explosion",
  "Party",
  "Food Place",
  "Mess Hall",
  "Lounge",
  "Farm",
  "Banquet",
  "Dish",
  "Works",
  "Factory",
  "Dining",
  "Central",
  "City",
  "Market",
  "Bazaar",
  "Desire",
  "Shanty",
  "Horn of Pleanty",
  "Smorgasbord",
  "Fantasy",
  "Wagon",
  "Truck",
  "Sizzle",
  "Palace",
  "Chef",
  "Binge",
  "Perfection",
  "Bliss",
  "Bytes",
  "Cafeteria",
  "Inn",
  "Cafe",
  "Discovery",
  "Town",
  "Canteen",
  "Grill",
  "Dive",
  "Drive In",
  "Eatery",
  "Joint",
  "Stand",
  "Hideaway",
  "Chophouse",
  "Watering Hole"
]

export const nameEmailRoleArray = [
  {
    name: "admin",
    email: "admin@email.com",
    role: "ADMIN"
  },
  {
    name: "owner",
    email: "owner@email.com",
    role: "RESTAURANT_OWNER"
  },
  {
    name: "user",
    email: "user@email.com",
    role: "REGULAR"
  }
]

export const getRandomRestaurantName = (ownerFirstName: string) => {
  // 1 in 3 chance the Owner puts their name in the title
  let restaurantName = ""
  let rand: number
  if (Math.floor(Math.random() * 3) < 1) {
    restaurantName += `${ownerFirstName}'s `
  }

  // 1 in 2 chance the Onwer puts an optional descriptor in the title
  let hasDescriptor = false
  if (Math.floor(Math.random() * 2) < 1) {
    rand = Math.floor(Math.random() * optionalDescriptor.length)
    restaurantName += `${optionalDescriptor[rand]} `
    hasDescriptor = true
  }

  // append the type
  rand = Math.floor(Math.random() * restaurantType.length)
  restaurantName += `${restaurantType[rand]}`

  // if no descriptor append a 'part two' else 1 in 2 chance
  let appendPartTwo = true
  if (hasDescriptor && Math.floor(Math.random() * 2) < 1) {
    appendPartTwo = false
  }

  if (appendPartTwo) {
    rand = Math.floor(Math.random() * restaurantTypePartTwo.length)
    restaurantName += ` ${restaurantTypePartTwo[rand]}`
  }

  return restaurantName
}

// 10% chance 0-1 stars
// 15% chance 1.5 - 2.5 stars
// 40% chance 3 - 4 stars
// 20% chance 4.5 stars
// 15% chance 5 stars
export const generateRandomStarRating = () => {
  let chanceNumber = Math.floor(Math.random() * 20)

  if (chanceNumber < 2) {
    return parseFloat((0.5 * Math.floor(Math.random() * 3)).toFixed(1))
  } else if (chanceNumber < 5) {
    return parseFloat((0.5 * Math.floor(Math.random() * 3) + 1.5).toFixed(1))
  } else if (chanceNumber < 13) {
    return parseFloat((0.5 * Math.floor(Math.random() * 3) + 3).toFixed(1))
  } else if (chanceNumber < 17) {
    return 4.5
  } else {
    return 5
  }
}
