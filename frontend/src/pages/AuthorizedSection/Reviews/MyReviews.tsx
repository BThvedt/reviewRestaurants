import React, { useState, FC, useEffect } from "react"
import { GET_REVIEWS_BY_USER } from "gql/queries"
import { Review } from "generated/graphql-frontend"
import { useQuery } from "@apollo/client"
import { ReviewListItem } from "components"
import { CurrentUser } from "types"
import { Link } from "react-router-dom"

interface ParamTypes {
  id: string
}

interface IProps {
  siteUser: CurrentUser
}

let MyReviews: FC<IProps> = ({ siteUser }) => {
  let [reviewList, setReviewList] = useState<Review[]>([])

  const {
    loading,
    error,
    data: { getReviewsByUser: reviews } = { getReviewsByUser: [] }
  } = useQuery<{ getReviewsByUser: Review[] }>(GET_REVIEWS_BY_USER, {
    variables: {
      userId: siteUser.id
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
            You have <span className="font-bold">{reviewList.length}</span>{" "}
            Reviews!
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
        <p className="m-2 text-center text-lg">
          You has no Reviews.{" "}
          <span className="font-bold hover:text-green-400 cursor-pointer">
            <Link to="/restaurants/">Visit a restaurant</Link>
          </span>{" "}
          to leave one!!
        </p>
      )}
    </div>
  )
}

export default MyReviews
