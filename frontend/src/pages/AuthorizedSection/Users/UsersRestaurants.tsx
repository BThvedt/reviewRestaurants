import React, { FC, useState, useEffect } from "react"
import { RestaurantOwnerReturnData } from "generated/graphql-frontend"
import { useQuery } from "@apollo/client"
import { GET_RESTAURANTS_BY_OWNER } from "gql/queries"
import RestaurantList from "components/Restaurant/RestaurantList"
import { CurrentUser } from "types"

interface IProps {
  siteUser: CurrentUser
  paramsId: string
}

interface ParamTypes {
  id: string
}

let UserPage: FC<IProps> = ({ siteUser, paramsId }) => {
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

  // better error component needed
  if (error) {
    return <p>There was an error Getting Restaurants</p>
  }

  return (
    <>
      <div className="flex justify-between items-center pb-4" />

      <h3 className="text-xl text-center hover:text-green-400 cursor-pointer">
        + Create A Restaurant
      </h3>

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
