import React, { FC, useState, useEffect } from "react"
import { RestaurantOwnerReturnData } from "generated/graphql-frontend"
import { GET_RESTAURANTS_BY_OWNER } from "gql/queries"
import { CREATE_RESTAURANT, UPDATE_RESTAURANT } from "gql/mutations"
import RestaurantList from "components/Restaurant/RestaurantList"
import { CurrentUser } from "types"
import { useMutation, useQuery } from "@apollo/client"
import { UserRole } from "generated/graphql-frontend"

interface IProps {
  siteUser: CurrentUser
  paramsId: string
}

interface ParamTypes {
  id: string
}

const classes = {
  field:
    "w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out",
  button:
    "bg-green-400 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark",
  cancelButton:
    "bg-red-300 py-2 px-4 text-sm text-white rounded border border-red focus:outline-none focus:border-red-dark"
}

let UserPage: FC<IProps> = ({ siteUser, paramsId }) => {
  const [creatingRestaurant, setCreatingRestaurant] = useState(false)
  const [restaurantName, setRestaurantName] = useState("")
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  let [restaurantList, setRestuarantList] = useState<
    RestaurantOwnerReturnData[]
  >([])

  const {
    loading,
    error,
    data: { getRestaurantsByOwner: ownerRestaurantList } = {
      getRestaurantsByOwner: []
    }
  } = useQuery<{ getRestaurantsByOwner: RestaurantOwnerReturnData[] }>(
    GET_RESTAURANTS_BY_OWNER,
    {
      variables: {
        ownerId: paramsId
      }
    }
  )!

  useEffect(() => {
    if (ownerRestaurantList) {
      setRestuarantList(ownerRestaurantList)
    }
  }, [ownerRestaurantList])

  const [createRestaurant, { data }] = useMutation(CREATE_RESTAURANT, {
    refetchQueries: [
      { query: GET_RESTAURANTS_BY_OWNER, variables: { ownerId: paramsId } }
      // { query: GET_CURRENT_USER },
      // { query: GET_USER_NAME_AND_ROLE, variables: { id } }
    ],
    onCompleted: (data) => {
      setShowError(false)
      setShowSuccess(true)
      setCreatingRestaurant(false)
      setRestaurantName("")
    },
    onError: (error) => {
      console.log(error)
      setShowError(true)
      setShowSuccess(false)
    }
  })

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    setShowError(false)
    setShowSuccess(false)

    // ok this is not strict but for simplicity's sake
    if (restaurantName.length > 3) {
      createRestaurant({
        variables: {
          data: {
            name: restaurantName,
            owner_id: paramsId
          }
        }
      })
    }
  }

  // better error component needed
  if (error) {
    return <p>There was an error Getting Restaurants</p>
  }

  return (
    <>
      <div className="flex justify-between items-center pb-4" />

      {showSuccess && (
        <p className="text-lg text-center text-green-500">
          Restaurant successfully created!
        </p>
      )}
      {showError && (
        <p className="text-lg text-center text-red-400">
          Something went wrong!
        </p>
      )}

      {!creatingRestaurant &&
        (paramsId === siteUser.id || siteUser.role === UserRole.Admin) && (
          <h3
            className="text-xl text-center hover:text-green-400 cursor-pointer mb-4"
            onClick={() => {
              setCreatingRestaurant(true)
              setShowError(false)
              setShowSuccess(false)
              setRestaurantName("")
            }}
          >
            + Create A Restaurant
          </h3>
        )}

      {creatingRestaurant && (
        <div className="flex items-center flex-col mb-4">
          <form onSubmit={onSubmit} className="w-1/2">
            <div className="mb-4">
              <label htmlFor="restaurantName">Restaurant Name</label>
              <input
                id="restaurantName"
                name="name"
                value={restaurantName || ""}
                placeholder="Restaurant Name"
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
                  setCreatingRestaurant(false)
                  setShowError(false)
                  setShowSuccess(false)
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
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {!loading && restaurantList && (
        <div>
          <RestaurantList
            restaurants={restaurantList}
            ownerId={paramsId}
            siteUser={siteUser}
          />
        </div>
      )}

      <div className="flex justify-center items-center mt-3 mb-3" />
    </>
  )
}

export default UserPage
