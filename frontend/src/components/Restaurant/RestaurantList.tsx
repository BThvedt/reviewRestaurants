import React, { FC, useState } from "react"
import RestaurantTitle from "./RestaurantTitle"
import FeaturedReview from "./FeaturedReveiew"
import ListContainer from "../ListContainer"
import { CurrentUser } from "types"
import { Link } from "react-router-dom"
import { useQuery, useMutation } from "@apollo/client"
import {
  RestaurantReturnData,
  RestaurantOwnerReturnData,
  UserRole
} from "generated/graphql-frontend"
import { DELETE_RESTAURANT } from "gql/mutations"
import { GET_RESTAURANTS_BY_OWNER } from "gql/queries"
import { useEffect } from "react"
import EditRestaurantForm from "./EditRestaurantForm"

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
  const [showEditAndDeleteButton, setShowEditAndDeleteButton] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState(false)
  const [deleteRestaurant, { data }] = useMutation(DELETE_RESTAURANT, {
    refetchQueries: [
      {
        query: GET_RESTAURANTS_BY_OWNER,
        variables: { ownerId }
      }
    ],
    onCompleted: (data) => {
      alert("restaurant deleted")
    },
    onError: (error) => {
      console.log(error)
      alert("There was an error deleting that restaurant")
    }
  })

  useEffect(() => {
    if (
      (ownerId &&
        siteUser &&
        ownerId === siteUser.id &&
        !showEditAndDeleteButton) ||
      siteUser?.role === UserRole.Admin
    ) {
      setShowEditAndDeleteButton(true)
    }
  }, [ownerId, siteUser])

  return (
    <>
      {restaurants.map((restaurantData) => {
        let reviews_pending_reply: number | null

        const { restaurant, featured_review } = restaurantData

        // since I use this in multiple situations, have to typecheck AND check if the userId is the siteuser id
        // could probably use a refactor. Hmmmm ..
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
            {showEditAndDeleteButton && !editingRestaurant && (
              <div className="flex absolute right-2 bottom-2 ">
                <p
                  className=" text-sm  text-red-400 cursor-pointer hover:underline mr-4"
                  onClick={() => {
                    setEditingRestaurant(true)
                  }}
                >
                  Edit
                </p>
                <p
                  className=" text-sm  text-red-400 cursor-pointer hover:underline"
                  onClick={() => {
                    if (window.confirm("Really delete this restaurant?")) {
                      console.log(`ID IS ${id}`)
                      deleteRestaurant({
                        variables: {
                          id
                        }
                      })
                    }
                  }}
                >
                  Delete
                </p>
              </div>
            )}
            {editingRestaurant && ownerId && (
              <EditRestaurantForm
                restaurantId={id}
                theRestaurantName={name}
                setEditingRestaurant={setEditingRestaurant}
                ownerId={ownerId}
              />
            )}
          </ListContainer>
        )
      })}
    </>
  )
}

export default RestaurantList
