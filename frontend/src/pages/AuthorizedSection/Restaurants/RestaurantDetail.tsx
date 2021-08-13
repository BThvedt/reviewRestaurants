import React, { FC, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import { GET_RESTAURANT } from "gql/queries"
import { Restaurant, RestaurantData, Review } from "generated/graphql-frontend"
import { useQuery } from "@apollo/client"
import { TitleOrMenu } from "components"
import { FormatDate } from "lib"
import ReactStars from "react-rating-stars-component"
import { CurrentUser } from "types"
import { CommentReply, ReviewListItem } from "components"

interface ParamTypes {
  id: string
}

interface IProps {
  siteUser: CurrentUser
}

let RestaurantDetail: FC<IProps> = ({ siteUser }) => {
  const [restaurant, setRestaurant] = useState<Restaurant>()
  const [featuredReview, setFeaturedReview] = useState<Review | null>()
  const [reviews, setReviews] = useState<Review[]>()

  let { id } = useParams<ParamTypes>()

  const {
    loading,
    error,
    data: { getRestaurant } = {}
  } = useQuery<{ getRestaurant: RestaurantData }>(GET_RESTAURANT, {
    variables: {
      id
    }
  })!

  useEffect(() => {
    // there should always be a restaurant exept if error .. this is just to make typescript happy
    if (!loading && getRestaurant) {
      const { featured_review, restaurant } = getRestaurant

      if (!restaurant) return

      setRestaurant(restaurant!)
      setFeaturedReview(featured_review)

      let { reviews } = restaurant

      if (featured_review) {
        // if there's a featured review, there's at least one review! Don't be afraid of all the '!' here
        const featuredId = featured_review.id
        reviews = reviews!.filter((review) => {
          console.log({ featuredId, reviewId: review!.id })
          return review!.id !== featuredId
        })
      }

      if (reviews && reviews.length) {
        setReviews(reviews)
      }
    }
  }, [getRestaurant, loading])

  if (error) {
    return <p>There was some sort of Error getting this page</p>
  }

  return (
    <>
      {restaurant && (
        <>
          <div className="mt-2">
            <TitleOrMenu title={restaurant.name} />
          </div>
          <div className="text-center">
            <Link to={`/users/${restaurant.owner?.id}/restaurants`}>
              <p className="text-sm hover:text-green-400">
                Owner: {restaurant.owner?.name} (
                {restaurant.owner?.restaurants?.length}{" "}
                {`Restaurant${
                  restaurant.owner?.restaurants?.length || 0 > 1 ? "s" : ""
                }`}
                )
              </p>
            </Link>
          </div>
          <div className="flex items-center justify-center flex-col">
            <ReactStars
              count={5}
              size={45}
              edit={false}
              color={"#bbb"}
              activeColor="#818cf8"
              isHalf={true}
              value={
                restaurant.average_rating
                  ? Math.round(restaurant.average_rating * 2) / 2
                  : 0
              }
            />
            <p>- Average Rating: {restaurant.average_rating?.toFixed(2)} -</p>
            {(restaurant.num_of_ratings || restaurant.num_of_reviews) && (
              <p className="text-gray-700 text-sm">
                {restaurant.num_of_ratings || 0}{" "}
                {`Rating${restaurant.num_of_ratings || 0 > 1 ? "s" : ""}`}{" "}
                {restaurant.num_of_reviews || 0}{" "}
                {`Review${restaurant.num_of_reviews || 0 > 1 ? "s" : ""}`}{" "}
              </p>
            )}
            {featuredReview && (
              <>
                <p className="text-xl font-bold p-4 pb-1">Featured Review:</p>
                <p className="text-sm pb-2">
                  Visited {FormatDate(new Date(featuredReview.visited))}
                </p>
                <p className="italic text-lg">
                  "{featuredReview.comment?.title}"
                </p>
                <ReactStars
                  count={5}
                  size={25}
                  edit={false}
                  color={"transparent"}
                  activeColor={"#aaa"}
                  isHalf={true}
                  value={
                    restaurant.average_rating
                      ? Math.round(restaurant.average_rating * 2) / 2
                      : 0
                  }
                />
                <p className="text-lg text-gray-700 text-center mt-1">
                  {featuredReview.comment?.text}
                </p>

                <Link to={`/users/${featuredReview.user?.id}/reviews`}>
                  <p className="text-gray-700 hover:text-green-400">
                    - {featuredReview.user?.name} (
                    {featuredReview.user?.num_of_reviews}{" "}
                    {`Review${
                      featuredReview.user?.num_of_reviews || 0 > 1 ? "s" : ""
                    }`}
                    )
                  </p>
                </Link>

                <CommentReply
                  review={featuredReview}
                  restaurant={restaurant}
                  siteUser={siteUser}
                />
              </>
            )}
            {reviews && (
              <div className="text-gray-700 ">
                <p className="text-lg font-bold p-4 pb-2 text-center">
                  - Reviews and Ratings -
                </p>
                {reviews.map((review) => {
                  return (
                    <ReviewListItem
                      key={review.id}
                      review={review}
                      restaurant={restaurant}
                      siteUser={siteUser}
                      replyTitleCentered={true}
                      linkReviews={true}
                    />
                  )
                })}
              </div>
            )}
            {!reviews && (
              <div className="text-gray-700 ">
                <p className="text-lg font-bold p-4 pb-2 text-center">
                  - No Reviews -
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default RestaurantDetail
