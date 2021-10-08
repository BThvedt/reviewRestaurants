import React, { FC, useState } from "react"
import { Review, Restaurant, UserRole } from "generated/graphql-frontend"
import { CurrentUser } from "types"
import { DELETE_REPLY } from "gql/mutations"
import { GET_RESTAURANT } from "gql/queries"
import CommentReplyForm from "components/Restaurant/CommentReplyForm"
import { useMutation } from "@apollo/client"

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
  const [editing, setEditing] = useState<boolean>(false)
  const [deleteReply, { data }] = useMutation(DELETE_REPLY, {
    refetchQueries: [
      { query: GET_RESTAURANT, variables: { id: restaurant?.id } }
    ],
    onCompleted: (data) => {
      alert("reply deleted")
    },
    onError: (error) => {
      console.log(error)
      alert("There was an error deleting the reply")
    }
  })

  return (
    <div>
      {review.comment?.reply && (
        <div className="mb-2">
          {titleCentered && !editing && (
            <h1 className="text text-sm font-bold text-gray-600 mt-2 text-center">
              {restaurant?.owner?.id === siteUser.id
                ? "- You Replied -"
                : "- Owner Reply -"}
            </h1>
          )}
          {!titleCentered && !editing && (
            <h1 className="text font-bold text-gray-600 mt-2 ">
              {restaurant?.owner?.id === siteUser.id
                ? "You Replied: "
                : "Owner Reply: "}
            </h1>
          )}
          {!editing && <p className="text-sm">{review.comment?.reply?.text}</p>}
          {(restaurant?.owner?.id === siteUser.id ||
            siteUser.role === UserRole.Admin) &&
            !editing && (
              <div className="text text-sm text-gray-600 text-center text-red-500 cursor-pointer flex justify-end">
                <p
                  className="hover:text-green-400 mr-3"
                  onClick={() => {
                    setEditing(true)
                  }}
                >
                  Edit
                </p>
                <p
                  className="hover:text-green-400"
                  onClick={() => {
                    if (review.comment?.reply?.id) {
                      deleteReply({
                        variables: {
                          id: review.comment.reply.id
                        }
                      })
                    }
                  }}
                >
                  Delete
                </p>
              </div>
            )}
        </div>
      )}

      {!review.comment?.reply && restaurant?.owner?.id === siteUser.id && (
        <div className="mb-2">
          {/* <h1 className="text text-sm text-gray-600 text-center text-red-500">
            + Add Reply
          </h1> */}
          <CommentReplyForm
            comment_id={review.comment?.id}
            siteUser={siteUser}
            restaurant_id={restaurant.id}
          />
        </div>
      )}

      {editing &&
        review.comment?.reply &&
        restaurant?.owner?.id === siteUser.id && (
          <div className="mb-2">
            {/* <h1 className="text text-sm text-gray-600 text-center text-red-500">
            + Add Reply
          </h1> */}
            <CommentReplyForm
              comment_id={review.comment!.id}
              siteUser={siteUser}
              restaurant_id={restaurant.id}
              existingReply={review.comment?.reply}
              setEditing={setEditing}
            />
          </div>
        )}
    </div>
  )
}

export default CommentReply
