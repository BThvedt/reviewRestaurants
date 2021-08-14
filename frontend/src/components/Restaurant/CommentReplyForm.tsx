import React, { useState, FC, useEffect } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { CREATE_REPLY, UPDATE_REPLY } from "gql/mutations"
import { GET_RESTAURANT } from "gql/queries"
import "lib/DatePicker.scss"
import { useMutation } from "@apollo/client"
import { CurrentUser } from "types"
import { Reply } from "generated/graphql-frontend"

const classes = {
  field:
    "w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out",
  button:
    "bg-green-400 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark",
  cancelButton:
    "bg-red-300 py-2 px-4 text-sm text-white rounded border border-red focus:outline-none focus:border-red-dark"
}

interface IProps {
  comment_id: string
  siteUser: CurrentUser
  restaurant_id: string
  existingReply?: Reply
  setEditing?: (editing: boolean) => void
}

const CommentReplyForm: FC<IProps> = ({
  comment_id,
  siteUser,
  restaurant_id,
  existingReply,
  setEditing
}) => {
  const [creatingReply, setCreatingReply] = useState(false)
  const [reply, setReply] = useState("")
  const [error, setError] = useState(false)
  const [replyLoaded, setReplyLoaded] = useState(false)

  // oof gotta go way up the query tree to update this one!!
  const [createReply, { data }] = useMutation(CREATE_REPLY, {
    refetchQueries: [
      { query: GET_RESTAURANT, variables: { id: restaurant_id } }
    ],
    onCompleted: (data) => {
      setError(false)
      setCreatingReply(false)
      setReply("")
    },
    onError: (error) => {
      setError(true)
    }
  })

  const [updateReply, { data: updateDate }] = useMutation(UPDATE_REPLY, {
    refetchQueries: [
      { query: GET_RESTAURANT, variables: { id: restaurant_id } }
    ],
    onCompleted: (data) => {
      setError(false)
      setEditing && setEditing(false)
      setReply("")
    },
    onError: (error) => {
      console.log(error)
      setError(true)
    }
  })

  useEffect(() => {
    if (existingReply) {
      setReply(existingReply.text)
    }
    setReplyLoaded(true)
  }, [existingReply])

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    setError(false)

    if (!existingReply) {
      // simple validation, a real form would need better
      if (reply.length > 3) {
        createReply({
          variables: {
            data: {
              comment_id,
              text: reply
            }
          }
        })
      }
    } else {
      if (reply.length > 3) {
        updateReply({
          variables: {
            id: existingReply.id,
            text: reply
          }
        })
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {!creatingReply && !existingReply && (
        <div className="mb-2">
          <h1
            className="text text-sm text-gray-600 text-center text-red-500 hover:text-green-400 cursor-pointer"
            onClick={() => {
              setCreatingReply(true)
            }}
          >
            + Add Reply
          </h1>
        </div>
      )}
      {(creatingReply || existingReply) && (
        <form onSubmit={onSubmit} className="w-full">
          {error && (
            <p className="text-lg text-center text-red-400">
              Something went wrong!
            </p>
          )}
          <div className="mb-2 flex-col items-center justify-center">
            {!existingReply && <label htmlFor="reply">Your Reply</label>}
            {existingReply && <label htmlFor="reply">Update your Reply</label>}
            <textarea
              id="reply"
              name="reply"
              value={reply || ""}
              placeholder={existingReply ? "Edit Reply" : "Your Reply"}
              className={`${classes.field} ${
                replyLoaded && reply.length < 3 ? "bg-red-100" : ""
              }`}
              onChange={(e) => setReply(e.target.value)}
            />
            {reply.length < 3 && (
              <p className="text-sm  text-red-400">
                Your Reply must be at least 3 letters long
              </p>
            )}
          </div>
          <div className="flex items-end justify-end ">
            <button
              className={`${classes.cancelButton} mr-3 `}
              onClick={(e) => {
                e.preventDefault()
                setReply("")
                setError(false)

                if (existingReply && setEditing) {
                  // we are editing and the display is controlled by the parent
                  setEditing(false)
                } else {
                  setCreatingReply(false)
                }
              }}
            >
              Cancel
            </button>
            <button
              disabled={reply.length < 3}
              className={`${classes.button} ${
                reply.length < 3 ? "opacity-30 cursor-default" : ""
              }`}
            >
              {existingReply ? "Edit" : "Create"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CommentReplyForm
