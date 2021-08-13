import React, { useState, FC, useEffect } from "react"
import { GET_REVIEWS } from "gql/queries"
import { ReviewsReturnData, Review } from "generated/graphql-frontend"
import { useQuery } from "@apollo/client"
import Pager from "components/Pager"
import { ReviewListItem } from "components"
import { CurrentUser } from "types"

interface IProps {
  siteUser: CurrentUser
}

let AllReviews: FC<IProps> = ({ siteUser }) => {
  let [page, setPage] = useState(0)
  let [reviewCount, setReviewCount] = useState(0)
  let [reviewList, setReviewList] = useState<Review[]>([])

  const {
    loading,
    error,
    data: { getReviews: { count, reviews } } = {
      getReviews: { count: 0, reviews: [] }
    }
  } = useQuery<{
    getReviews: ReviewsReturnData
  }>(GET_REVIEWS, {
    variables: {
      data: {
        page: page,
        recordsPerPage: 20
      }
    }
  })

  useEffect(() => {
    if (count && !reviewCount) {
      setReviewCount(count)
    }

    if (!loading && reviews.length) {
      setReviewList(reviews)
    }
  }, [count, reviews, loading])

  if (error) {
    return <p>Something went wrong</p>
  }

  return (
    <>
      <div className="flex justify-between items-center">
        {reviewCount && (
          <>
            <div className="flex items-center">
              <p>
                {20 * page + 1}-{20 * page + reviews.length} of {reviewCount}
              </p>
            </div>

            <Pager
              forcePage={page}
              setPage={setPage}
              count={reviewCount}
              itemsPerPage={20}
            />
          </>
        )}
      </div>
      <div>
        {reviewList.length && (
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
                  linkReviews={true}
                />
              )
            })}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center mt-3 mb-3">
        {reviewCount && (
          <Pager
            forcePage={page}
            setPage={setPage}
            count={reviewCount}
            itemsPerPage={20}
          />
        )}
      </div>
    </>
  )
}

export default AllReviews
