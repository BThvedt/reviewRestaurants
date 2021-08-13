import React, { FC } from "react"
import { useLocation, Link } from "react-router-dom"

let RestaurantListSubMenu: FC = () => {
  const location = useLocation()
  return (
    <>
      <div className="lg:px-16 px-6 flex flex-wrap items-center justify-center lg:py-0 py-2">
        <ul className="flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0">
          <li
            className={`border-b-2 border-transparent hover:border-indigo-400 ${
              location.pathname.includes("/restaurants/mine")
                ? "border-indigo-400 "
                : ""
            }`}
          >
            <Link to="/restaurants/mine" className="p-3 block text-xl ">
              <h2 className=" relative">My Restaurants</h2>
            </Link>
          </li>
          <li
            className={`border-b-2 border-transparent hover:border-indigo-400 ${
              !location.pathname.includes("/restaurants/mine")
                ? "border-indigo-400 "
                : ""
            }`}
          >
            <Link to="/restaurants" className="p-3 block text-xl">
              <h2 className="relative">All Restaurants</h2>
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default RestaurantListSubMenu
