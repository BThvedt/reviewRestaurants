import React, { useState, FC, useEffect } from "react"
import { Link } from "react-router-dom"
import { GET_REVIEWS_BY_USER } from "gql/queries"
import { ReviewsReturnData, Review, User } from "generated/graphql-frontend"
import { useQuery } from "@apollo/client"
import Pager from "components/Pager"
import { ReviewListItem } from "components"
import { CurrentUser } from "types"

interface IProps {
  siteUser: CurrentUser
  paramsId: String
}

let UserReviews: FC<IProps> = ({ siteUser, paramsId }) => {
  let [reviewList, setReviewList] = useState<Review[]>([])

  const {
    loading,
    error,
    data: { getReviewsByUser: reviews } = { getReviewsByUser: [] }
  } = useQuery<{ getReviewsByUser: Review[] }>(GET_REVIEWS_BY_USER, {
    variables: {
      userId: paramsId
    }
  })!

  useEffect(() => {
    if (!loading && reviews.length) {
      setReviewList(reviews)
    }
  }, [reviews, loading])

  if (error) {
    return <p>Something went wrong</p>
  }

  return (
    <div className="mt-3 pb-6">
      {reviewList.length ? (
        <>
          <p className="m-2 text-center text-lg">
            <span className="font-bold">{reviewList.length}</span>{" "}
            {`Review${reviewList.length > 1 ? "s" : ""}`}
          </p>
          <div className="text-gray-700 ">
            {reviews.map((review) => {
              return (
                <ReviewListItem
                  key={review.id}
                  review={review}
                  restaurant={review.restaurant || undefined}
                  siteUser={siteUser}
                  replyTitleCentered={false}
                  showRestaurantInfo={true}
                />
              )
            })}
          </div>
        </>
      ) : (
        <p className="flex justify-center">
          {paramsId === siteUser.id ? (
            <>
              <p>
                You have no Reviews.{" "}
                <Link to="/restaurants">
                  <span className="hover:text-green-400 underline">
                    Visit a restaurant
                  </span>
                </Link>{" "}
                to leave one!!`
              </p>
            </>
          ) : (
            <p>This user has no reviews</p>
          )}
        </p>
      )}
    </div>
  )
}

export default UserReviews
