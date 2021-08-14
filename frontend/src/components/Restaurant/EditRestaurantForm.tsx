import React, { FC, useState, useEffect } from "react"
import { UPDATE_RESTAURANT } from "gql/mutations"
import { GET_RESTAURANTS_BY_OWNER } from "gql/queries"
import { useMutation, useQuery } from "@apollo/client"

interface IProps {
  theRestaurantName: string
  setEditingRestaurant: (updating: boolean) => void
  ownerId: string
  restaurantId: string
}

const EditRestaurantForm: FC<IProps> = ({
  theRestaurantName,
  setEditingRestaurant,
  ownerId,
  restaurantId
}) => {
  const [error, setError] = useState(false)
  const [restaurantName, setRestaurantName] = useState("")

  useEffect(() => {
    if (!restaurantName) {
      setRestaurantName(theRestaurantName)
    }
  }, [theRestaurantName])

  const [updateRestaurant, { data }] = useMutation(UPDATE_RESTAURANT, {
    refetchQueries: [
      {
        query: GET_RESTAURANTS_BY_OWNER,
        variables: { ownerId }
      }
    ],
    onCompleted: (data) => {
      setEditingRestaurant(false)
    },
    onError: (error) => {
      alert("There was an error updating that restaurant")
    }
  })

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    // setShowError(false)
    // setShowSuccess(false)
    // // ok this is not strict but for simplicity's sake
    if (restaurantName.length > 3) {
      updateRestaurant({
        variables: {
          id: restaurantId,
          data: {
            name: restaurantName,
            owner_id: ownerId
          }
        }
      })
    }
  }

  const classes = {
    field:
      "w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out",
    button:
      "bg-green-400 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark",
    cancelButton:
      "bg-red-300 py-2 px-4 text-sm text-white rounded border border-red focus:outline-none focus:border-red-dark"
  }

  return (
    <div className="flex items-center flex-col mb-4">
      <form onSubmit={onSubmit} className="w-1/2">
        <div className="mb-4">
          <label htmlFor="restaurantName">Edit Restaurant</label>
          <input
            id="restaurantName"
            name="name"
            value={restaurantName || ""}
            placeholder="New Name"
            className={`${classes.field} ${
              restaurantName.length < 3 ? "bg-red-100" : ""
            }`}
            onChange={(e) => setRestaurantName(e.target.value)}
          />
          {restaurantName.length < 3 && (
            <p className="text-sm  text-red-400">
              Restaurant Name must be at least 3 letters long
            </p>
          )}
        </div>
        <div className="flex items-center justify-end">
          <button
            className={`${classes.cancelButton} mr-3 `}
            onClick={(e) => {
              e.preventDefault()
              setEditingRestaurant(false)
              setError(false)
            }}
          >
            Cancel
          </button>
          <button
            disabled={restaurantName.length < 3}
            className={`${classes.button} ${
              restaurantName.length < 3 ? "opacity-30 cursor-default" : ""
            }`}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditRestaurantForm
