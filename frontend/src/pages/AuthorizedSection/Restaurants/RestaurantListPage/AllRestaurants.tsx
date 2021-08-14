import React, { useState, useEffect, FC, useMemo, useCallback } from "react"
import { GET_RESTAURANTS } from "gql/queries"
import {
  RestaurantReturnData,
  RestaurantsReturnData
} from "generated/graphql-frontend"
import { useQuery } from "@apollo/client"
import Pager from "components/Pager"
import RestaurantList from "components/Restaurant/RestaurantList"
import debounce from "lodash.debounce"

let AllRestaurants: FC = () => {
  const [page, setPage] = useState(0)
  const [restaurantCount, setRestaurantCount] = useState(0)
  const [sliderVal, setSliderVal] = useState<number>(0)
  const [starFilter, setStarFilter] = useState<number>(0)
  const [orderBy, setOrderBy] = useState("average_rating")
  const [direction, setDirection] = useState("desc")
  const [restaurantList, setRestuarantList] = useState<RestaurantReturnData[]>(
    []
  )
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
        orderBy: orderBy,
        direction,
        exclude_avg_below: starFilter
      }
    }
  })

  useEffect(() => {
    if (!loading && count) {
      setRestaurantCount(count)
    }

    if (!loading && restaurants.length) {
      setRestuarantList(restaurants)
    }
  }, [count, restaurants, loading])

  const delayedQuery = useCallback(
    debounce((sliderVal: number) => {
      setStarFilter(sliderVal)
    }, 1000),
    []
  )

  if (error) {
    return <p>Something went wrong</p>
  }

  return (
    <>
      {restaurantCount && (
        <>
          <div className="flex mt-4 justify-evenly items-start space-around text-grey-700">
            <div className="flex flex-col mt-4 justify-center mr-8">
              <div>
                <p className="mb-2">
                  Exlude Ratings Below: &nbsp; {sliderVal} Stars
                </p>
              </div>

              <input
                type="range"
                min="0"
                max="4.9"
                value={sliderVal}
                step={0.1}
                className="mb-2"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSliderVal(parseFloat(e.target.value))
                  delayedQuery(parseFloat(e.target.value))
                }}
              />
            </div>

            <div className="flex flex-col mt-4 justify-center mr-8">
              <p className="mb-2">Order By</p>
              <select
                name="orderBy"
                onChange={(e) => setOrderBy(e.target.value)}
              >
                <option value="average_rating">Avg Rating</option>
                <option value="num_of_ratings"># of Ratings</option>
              </select>
            </div>
            <div className="flex flex-col mt-4 justify-center">
              <p className="mb-2">Direction</p>
              <select
                name="orderDirectoin"
                onChange={(e) => setDirection(e.target.value)}
              >
                <option value="desc">Desc.</option>
                <option value="asc">Asc.</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center">
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
          </div>
        </>
      )}

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
