import React, { FC } from "react"
import { Review } from "generated/graphql-frontend"
import ReactStars from "react-rating-stars-component"

interface IProps {
  review: Review
}

let ReviewListHeader: FC<IProps> = ({ review }) => {
  return (
    <div className="flex justify-between items-start mb-2 -mt-2">
      <h1 className="text font-bold text-gray-600 mt-2 pr-6">
        {" "}
        {review.comment
          ? review.comment.title
          : `${review.user?.name} left a Rating: `}
      </h1>
      {review.rating && (
        <div
          className="flex items-center flex-shrink-0 justify-between"
          style={{ width: "145px" }}
        >
          <div className="relative ">
            <ReactStars
              count={5}
              size={25}
              edit={false}
              color={"transparent"}
              activeColor={"#aaa"}
              isHalf={true}
              value={Math.round(review.rating.stars * 2) / 2}
            />
          </div>
          <h3
            className="flex mr-1 relative text-gray-700"
            style={{ top: "2px" }}
          >
            {(Math.round(review.rating.stars * 2) / 2).toFixed(1)}
          </h3>
        </div>
      )}
    </div>
  )
}

export default ReviewListHeader
