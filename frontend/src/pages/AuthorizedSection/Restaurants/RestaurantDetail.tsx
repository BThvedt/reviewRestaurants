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
import { ReviewListItem } from "components"
import CreateReviewForm from "./CreateReviewForm"

interface ParamTypes {
  id: string
}

interface IProps {
  siteUser: CurrentUser
}

let RestaurantDetail: FC<IProps> = ({ siteUser }) => {
  const [restaurant, setRestaurant] = useState<Restaurant>()
  const [featuredReview, setFeaturedReview] = useState<Review | null>()
  const [bestReview, setBestReview] = useState<Review | null>()
  const [worstReview, setWorstReview] = useState<Review | null>()
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
      const { restaurant } = getRestaurant

      if (!restaurant) return

      setRestaurant(restaurant!)

      let { reviews } = restaurant

      // nah.. let's not do a featured review here
      // if (featured_review) {
      //   // if there's a featured review, there's at least one review! Don't be afraid of all the '!' here
      //   const featuredId = featured_review.id
      //   reviews = reviews!.filter((review) => {
      //     console.log({ featuredId, reviewId: review!.id })
      //     return review!.id !== featuredId
      //   })
      // }

      // but we do need the best and worst reviews
      if (reviews && reviews.length) {
        // get best review. Just sort by rating

        const sortedAndRatedReviews = reviews
          .filter((r) => r.rating?.stars)
          .sort((a, b) => (a.rating!.stars > b.rating!.stars ? -1 : 1))

        setBestReview(sortedAndRatedReviews[0])

        if (sortedAndRatedReviews.length > 1) {
          setWorstReview(
            sortedAndRatedReviews[sortedAndRatedReviews.length - 1]
          )
        }
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
              color={"#ddd"}
              activeColor="#818cf8"
              isHalf={true}
              value={
                restaurant.average_rating
                  ? Math.round(restaurant.average_rating * 2) / 2
                  : 0
              }
            />
            <p>- Average Rating: {restaurant.average_rating?.toFixed(2)} -</p>
            {restaurant.num_of_ratings || restaurant.num_of_reviews ? (
              <p className="text-gray-700 text-sm">
                {restaurant.num_of_ratings || 0}{" "}
                {`Rating${restaurant.num_of_ratings || 0 > 1 ? "s" : ""}`}{" "}
                {restaurant.num_of_reviews || 0}{" "}
                {`Review${restaurant.num_of_reviews || 0 > 1 ? "s" : ""}`}{" "}
              </p>
            ) : (
              <></>
            )}

            {bestReview ? (
              <div className="text-gray-700 flex justify-center items-start">
                <div
                  className={`m-4 text-gray-700 flex items-center  flex-col ${
                    worstReview ? "w-1/2" : ""
                  }`}
                >
                  <h1 className="text-lg font-bold  pb-1 text-center">
                    Best Review
                  </h1>

                  <ReactStars
                    count={5}
                    size={20}
                    edit={false}
                    color={"#ddd"}
                    activeColor="#818cf8"
                    isHalf={true}
                    value={bestReview.rating?.stars}
                  />
                  <p className="text-sm pb-2">
                    Visited {FormatDate(new Date(bestReview.visited))}
                  </p>
                  {bestReview.comment && (
                    <>
                      <p className="italic">"{bestReview.comment?.title}"</p>
                      <p className="mb-2">{bestReview.comment?.text}</p>
                    </>
                  )}
                  <Link to={`/users/${bestReview.user?.id}/reviews`}>
                    <p className="text-gray-700 hover:text-green-400 text-sm">
                      - {bestReview.user?.name} (
                      {bestReview.user?.num_of_reviews}{" "}
                      {`Review${
                        bestReview.user?.num_of_reviews || 0 > 1 ? "s" : ""
                      }`}
                      )
                    </p>
                  </Link>
                </div>
                {worstReview && (
                  <div className="m-4 text-gray-700 flex items-center  flex-col w-1/2">
                    <h1 className="text-lg font-bold  pb-2 text-center">
                      Worst Review
                    </h1>
                    <ReactStars
                      count={5}
                      size={20}
                      edit={false}
                      color={"#ddd"}
                      activeColor="#818cf8"
                      isHalf={true}
                      value={worstReview.rating?.stars}
                    />
                    <p className="text-sm pb-2">
                      Visited {FormatDate(new Date(bestReview.visited))}
                    </p>
                    {worstReview.comment && (
                      <>
                        <p className="italic">"{worstReview.comment?.title}"</p>
                        <p>{worstReview.comment?.text}</p>
                      </>
                    )}
                    <Link to={`/users/${worstReview.user?.id}/reviews`}>
                      <p className="text-gray-700 hover:text-green-400 text-sm">
                        - {worstReview.user?.name} (
                        {worstReview.user?.num_of_reviews}{" "}
                        {`Review${
                          worstReview.user?.num_of_reviews || 0 > 1 ? "s" : ""
                        }`}
                        )
                      </p>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
            <CreateReviewForm restaurant_id={id} siteUser={siteUser} />
            {reviews && (
              <div className="text-gray-700 w-full">
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
