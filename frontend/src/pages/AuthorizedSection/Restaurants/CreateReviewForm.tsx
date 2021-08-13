import React, { useState, FC, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import ReactStars from "react-rating-stars-component"
import { CREATE_REVIEW } from "gql/mutations"
import {
  GET_RESTAURANT,
  GET_RESTAURANTS_BY_OWNER,
  GET_REVIEWS_BY_USER
} from "gql/queries"
import "lib/DatePicker.scss"
import { useMutation } from "@apollo/client"
import { CurrentUser } from "types"

const classes = {
  field:
    "w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out",
  button:
    "bg-green-400 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark",
  cancelButton:
    "bg-red-300 py-2 px-4 text-sm text-white rounded border border-red focus:outline-none focus:border-red-dark"
}

const defaultFormValues = {
  commentName: "",
  commentBody: "",
  visited: new Date(),
  rating: null as number | null
}

interface IProps {
  restaurant_id: string
  siteUser: CurrentUser
}

const CreateReviewForm: FC<IProps> = ({ restaurant_id, siteUser }) => {
  const [creatingReview, setCreatingReview] = useState(false)
  const [values, setValues] = useState(defaultFormValues)
  const [formValid, setFormValid] = useState(false)
  const [hasRating, setHasRating] = useState(false)
  const [hasComment, setHasComment] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  // GET_RESTAURANT

  const [createReview, { data }] = useMutation(CREATE_REVIEW, {
    refetchQueries: [
      { query: GET_RESTAURANT, variables: { id: restaurant_id } },
      { query: GET_RESTAURANTS_BY_OWNER, variables: { ownerId: siteUser.id } }, // even admins only 'create' reviews for themselves
      { query: GET_REVIEWS_BY_USER, variables: { userId: siteUser.id } }
    ],
    onCompleted: (data) => {
      setError(false)
      setSuccess(true)
      setCreatingReview(false)
    },
    onError: (error) => {
      console.log(error)
      setError(true)
      setSuccess(false)
    }
  })

  useEffect(() => {
    // simplified logic, to save a little time I'm going full blown verification here
    let isFormValid = true

    if (
      hasComment &&
      (values.commentName.length < 3 || values.commentBody.length < 3)
    ) {
      isFormValid = false
    }

    if (!hasRating && !hasComment) {
      isFormValid = false
    }

    if (!values.visited) {
      isFormValid = false
    }

    setFormValid(isFormValid)
  }, [values, hasComment, hasRating])

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    setSuccess(false)
    setError(false)

    let mutationData: Record<string, any> = {
      visited: values.visited.toISOString(),
      restaurant_id
    }

    if (hasComment) {
      let { commentName, commentBody } = values
      mutationData.comment = {
        title: commentName,
        text: commentBody
      }
    }

    if (hasRating) {
      mutationData.rating = {
        stars: values.rating
      }
    }

    createReview({
      variables: {
        data: mutationData
      }
    })
  }

  return (
    <>
      {!creatingReview && (
        <h3
          className="text-xl text-center hover:text-green-400 cursor-pointer mb-4 mt-4"
          onClick={() => {
            setCreatingReview(true)
            setSuccess(false)
            setError(false)
          }}
        >
          + Create A Review
        </h3>
      )}

      {creatingReview && (
        <form onSubmit={onSubmit} className="w-2/3">
          {success && (
            <p className="text-lg text-center text-green-500">
              Review Creation Successful!
            </p>
          )}
          {error && (
            <p className="text-lg text-center text-red-400">
              Something went wrong!
            </p>
          )}
          <h2 className="text-center text-lg m-4 font-bold">- Your Review -</h2>
          {hasRating && (
            <div
              className="flex items-center justify-center flex-col"
              id="create-review-datepicker"
            >
              <label className="text-lg -mb-2">
                Your Rating: {values.rating?.toFixed(1)}{" "}
                {`Star${values.rating === 1 ? "" : "s"}`}
              </label>
              <ReactStars
                size={40}
                count={5}
                edit={true}
                color={"#ddd"}
                activeColor="#818cf8"
                isHalf={true}
                onChange={(newValue: number) => {
                  setValues({
                    ...values,
                    rating: newValue
                  })
                }}
              />
              <p
                className="hover:text-green-400 cursor-pointer text-center text-sm mb-3"
                onClick={() => {
                  setValues({ ...values, rating: null })
                  setHasRating(false)
                }}
              >
                - Cancel Rating
              </p>
            </div>
          )}
          {!hasRating && (
            <p
              className="hover:text-green-400 cursor-pointer text-center text-sm mb-3"
              onClick={() => {
                setHasRating(true)
                setValues({ ...values, rating: 0 })
              }}
            >
              + Add Star Rating
            </p>
          )}
          <div className="mb-4  text-center" id="create-review-datepicker">
            <label className="mb-4">Date of Visit</label>
            <DatePicker
              id="create-review-datepicker"
              selected={values.visited}
              onChange={(date) => {
                setValues({
                  ...values,
                  visited: date as Date
                })
              }}
            />
            {!values.visited && (
              <p className="text-sm  text-red-400">
                You must enter your date of visit
              </p>
            )}
          </div>
          {hasComment && (
            <>
              <div className="mb-4">
                <label htmlFor="commentName">Comment Name</label>
                <input
                  id="commentName"
                  name="commentName"
                  value={values.commentName || ""}
                  placeholder="Review Name"
                  className={`${classes.field} ${
                    values.commentName.length < 3 ? "bg-red-100" : ""
                  }`}
                  onChange={(e) =>
                    setValues({ ...values, commentName: e.target.value })
                  }
                />
                {values.commentName.length < 3 && (
                  <p className="text-sm  text-red-400">
                    Comment Name must be at least 3 letters long
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="commentBody">Comment Body</label>
                <textarea
                  id="commentBody"
                  name="commentBody"
                  value={values.commentBody || ""}
                  placeholder="Comment Body"
                  className={`${classes.field} ${
                    values.commentBody.length < 3 ? "bg-red-100" : ""
                  }`}
                  onChange={(e) =>
                    setValues({ ...values, commentBody: e.target.value })
                  }
                />
                {values.commentBody.length < 3 && (
                  <p className="text-sm  text-red-400">
                    Comment Body must be at least 3 letters long
                  </p>
                )}
              </div>
              <p
                className="hover:text-green-400 cursor-pointer text-sm mb-3 -mt-2"
                onClick={() => {
                  setValues({ ...values, commentName: "", commentBody: "" })
                  setHasComment(false)
                }}
              >
                - Remove Comment
              </p>
            </>
          )}
          {!hasComment && (
            <p
              className="hover:text-green-400 cursor-pointer text-sm mb-3 -mt-2 text-center"
              onClick={() => {
                setValues({ ...values, commentName: "", commentBody: "" })
                setHasComment(true)
              }}
            >
              + Add Comment
            </p>
          )}
          <div className="flex items-center justify-end">
            <button
              className={`${classes.cancelButton} mr-3 `}
              onClick={(e) => {
                e.preventDefault()
                setCreatingReview(false)
                setValues(defaultFormValues)
              }}
            >
              Cancel
            </button>
            <button
              disabled={!formValid}
              className={`${classes.button} ${
                formValid ? "" : "opacity-30 cursor-default"
              }`}
            >
              Create
            </button>
          </div>
        </form>
      )}
    </>
  )
}

export default CreateReviewForm
