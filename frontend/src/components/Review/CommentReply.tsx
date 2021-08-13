import React, { FC } from "react"
import { Review, Restaurant } from "generated/graphql-frontend"
import { CurrentUser } from "types"

interface IProps {
  review: Review
  restaurant?: Restaurant
  siteUser: CurrentUser
  titleCentered?: boolean
}

let CommentReply: FC<IProps> = ({
  review,
  restaurant,
  siteUser,
  titleCentered
}) => {
  return (
    <div>
      {review.comment?.reply && (
        <div className="mb-2">
          {titleCentered && (
            <h1 className="text text-sm font-bold text-gray-600 mt-2 text-center">
              {restaurant?.owner?.id === siteUser.id
                ? "- You Replied -"
                : "- Owner Reply -"}
            </h1>
          )}
          {!titleCentered && (
            <h1 className="text font-bold text-gray-600 mt-2 ">
              {restaurant?.owner?.id === siteUser.id
                ? "You Replied: "
                : "Owner Reply: "}
            </h1>
          )}
          <p className="text-sm">{review.comment?.reply?.text}</p>
        </div>
      )}

      {!review.comment?.reply && restaurant?.owner?.id === siteUser.id && (
        <div className="mb-2">
          <h1 className="text text-sm text-gray-600 text-center text-red-500">
            + Add Reply
          </h1>
        </div>
      )}
    </div>
  )
}

export default CommentReply
