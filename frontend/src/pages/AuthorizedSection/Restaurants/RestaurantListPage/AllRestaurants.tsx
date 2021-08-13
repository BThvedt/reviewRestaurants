import React, { useState, useEffect, FC } from "react"
import { GET_RESTAURANTS } from "gql/queries"
import {
  RestaurantReturnData,
  RestaurantsReturnData
} from "generated/graphql-frontend"
import { useQuery } from "@apollo/client"
import Pager from "components/Pager"
import RestaurantList from "components/Restaurant/RestaurantList"

let AllRestaurants: FC = () => {
  let [page, setPage] = useState(0)
  let [restaurantCount, setRestaurantCount] = useState(0)
  let [restaurantList, setRestuarantList] = useState<RestaurantReturnData[]>([])

  // note to self: there should be a better way to type these useQueries, but can't quite get it to work
  // try to figure out sometime later
  const {
    loading,
    error,
    data: { getRestaurants: { count, restaurants } } = {
      getRestaurants: { count: 0, restaurants: [] }
    }
  } = useQuery<{
    getRestaurants: RestaurantsReturnData
  }>(GET_RESTAURANTS, {
    variables: {
      data: {
        page: page,
        recordsPerPage: 20,
        orderBy: "average_rating",
        direction: "desc"
      }
    }
  })

  useEffect(() => {
    if (count && !restaurantCount) {
      setRestaurantCount(count)
    }

    if (!loading && restaurants.length) {
      setRestuarantList(restaurants)
    }
  }, [count, restaurants])

  if (error) {
    return <p>Something went wrong</p>
  }

  return (
    <>
      <div className="flex justify-between items-center">
        {restaurantCount && (
          <>
            <div className="flex items-center">
              <p>
                {20 * page + 1}-{20 * page + restaurants.length} of{" "}
                {restaurantCount}
              </p>
            </div>

            <Pager
              forcePage={page}
              setPage={setPage}
              count={restaurantCount}
              itemsPerPage={20}
            />
          </>
        )}
      </div>

      <div>
        {/* Perhaps a loading animation or a transition would be good here */}
        {/* <RestaurantList restaurants={restaurantList} /> */}
        {restaurantList.length ? (
          <RestaurantList restaurants={restaurantList} />
        ) : (
          <></>
        )}
      </div>

      <div className="flex justify-center items-center mt-3 mb-3">
        {restaurantCount && (
          <Pager
            forcePage={page}
            setPage={setPage}
            count={restaurantCount}
            itemsPerPage={20}
          />
        )}
      </div>
    </>
  )
}

export default AllRestaurants
