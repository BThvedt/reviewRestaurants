import React, { FC } from "react"
import RestaurantTitle from "./RestaurantTitle"
import FeaturedReview from "./FeaturedReveiew"
import ListContainer from "../ListContainer"
import { CurrentUser } from "types"
import { Link } from "react-router-dom"
import {
  RestaurantReturnData,
  RestaurantOwnerReturnData
} from "generated/graphql-frontend"

interface IProps {
  restaurants: RestaurantReturnData[] | RestaurantOwnerReturnData[]
  ownerId?: string // users/:id/restaurants passes in a ownerId id AND a siteuser
  siteUser?: CurrentUser
}

const isRestaurantOwnerData = (
  restaurantData: RestaurantReturnData | RestaurantOwnerReturnData
): restaurantData is RestaurantOwnerReturnData => {
  return (
    (restaurantData as RestaurantOwnerReturnData).reviews_pending_reply !==
    undefined
  )
}

let RestaurantList: FC<IProps> = ({ restaurants, ownerId, siteUser }) => {
  return (
    <>
      {restaurants.map((restaurantData) => {
        let reviews_pending_reply: number | null

        const { restaurant, featured_review } = restaurantData

        // since I use this in multiple situations, have to typecheck AND check if the userId is the siteuser id
        // could probably use a refactor
        if (isRestaurantOwnerData(restaurantData)) {
          if (ownerId && siteUser && ownerId !== siteUser.id) {
            reviews_pending_reply = null
          } else {
            reviews_pending_reply = restaurantData.reviews_pending_reply
          }
        } else {
          reviews_pending_reply = null
        }

        const { id, average_rating, name, num_of_ratings, num_of_reviews } =
          restaurant!

        return (
          <ListContainer key={id}>
            <RestaurantTitle
              name={name}
              num_of_reviews={num_of_reviews}
              num_of_ratings={num_of_ratings}
              average_rating={average_rating}
              id={id}
            />
            {featured_review ? (
              <FeaturedReview
                featured_review={featured_review}
                isPreview={true}
              />
            ) : (
              <></>
            )}
            {reviews_pending_reply ? (
              <Link
                to={`/restaurants/${id}`}
                className="flex justify-center text-red-400 hover:text-green-400"
              >
                {reviews_pending_reply} Reviews Pending Reply
              </Link>
            ) : (
              <></>
            )}
          </ListContainer>
        )
      })}
    </>
  )
}

export default RestaurantList
