import React, { useState, FC } from "react"
import { GET_RESTAURANTS_BY_OWNER } from "gql/queries"
import { RestaurantOwnerReturnData } from "generated/graphql-frontend"
import { useQuery } from "@apollo/client"
import Pager from "components/Pager"
import { useEffect } from "react"
import { CurrentUser } from "types"
import RestaurantList from "components/Restaurant/RestaurantList"

interface IProps {
  siteUser: CurrentUser
}

let OwnerRestaurantList: FC<IProps> = ({ siteUser }) => {
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
        ownerId: siteUser.id
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

      {!loading && (
        <div>
          <RestaurantList restaurants={restaurantList} />
        </div>
      )}

      {!restaurantList.length && (
        <p className="text-center">You have no restaurants</p>
      )}

      <div className="flex justify-center items-center mt-3 mb-3" />
    </>
  )
}

export default OwnerRestaurantList
