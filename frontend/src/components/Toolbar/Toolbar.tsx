import React, { useState, useEffect, FC, MouseEvent } from "react"
import { SpoonAndFork, HamburgerIcon, UserIcon } from "assets"
import { CurrentUser } from "types"
import { LOGOUT } from "gql/mutations"
import { GET_CURRENT_USER } from "gql/queries"
import { useApolloClient, useMutation } from "@apollo/client"
import { AnonUser } from "types"
import { useLocation, Link } from "react-router-dom"
import { UserRole } from "generated/graphql-frontend"

interface IProps {
  siteUser?: CurrentUser
  bodyClickToggle: boolean
}

const Toolbar: FC<IProps> = ({ siteUser, bodyClickToggle }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const location = useLocation()
  const client = useApolloClient()

  useEffect(() => {
    setShowProfileDropdown(false)
  }, [bodyClickToggle])

  const [logout] = useMutation(LOGOUT, {
    async onCompleted(data) {
      const { logout: success } = data

      if (success) {
        client.writeQuery({
          query: GET_CURRENT_USER,
          data: {
            currentUser: AnonUser
          }
        })
      } else {
        alert("there was an error logging out")
      }
    }
  })

  return (
    <header
      className="px-16 px-6 bg-white flex flex-wrap items-centerpy-0 "
      onClick={(e: MouseEvent) => {
        e.stopPropagation()
        setShowProfileDropdown(false)
      }}
    >
      <div className="flex flex-1 justify-between items-center ">
        <div className="flex flex-1 justify-left items-center ">
          <Link to="/">
            <img
              src={SpoonAndFork}
              alt="logo"
              className="cursor-pointer block w-10 h-10 "
            />
          </Link>
          {/* <label
            htmlFor="meno-toggle"
            className="cursor-pointer lg:hidden block w-10 h-10"
          >
            <img src={HamburgerIcon} alt="hamburger icon" />
          </label> */}
          <input type="checkbox" className="hidden" id="menu-toggle" />
          <div className="hidden lg:flex items-center w-auto w-full" id="menu">
            <nav>
              <ul className="lg:flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0">
                <li>
                  <Link to="/" className="lg:p-3 px-0 block ">
                    <h2 className="text-2xl relative">Restaurant Review</h2>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {siteUser?.id && (
          <div className="flex justify-left items-center ">
            <ul className="flex items-center justify-between text-base text-gray-700 pt-0 mr-8">
              <li
                className={`cursor-pointer py-4 block border-b-2 border-transparent hover:border-indigo-400 ml-4 text ${
                  location.pathname.includes("restaurants")
                    ? "border-indigo-400 "
                    : ""
                }`}
              >
                {siteUser.role === UserRole.RestaurantOwner ? (
                  <Link to={`/restaurants/mine`}>Restaurants</Link>
                ) : (
                  <Link to={`/restaurants/`}>Restaurants</Link>
                )}
              </li>
              <li
                className={`cursor-pointer py-4 block border-b-2 border-transparent hover:border-indigo-400 ml-4 text ${
                  location.pathname.includes("reviews")
                    ? "border-indigo-400 "
                    : ""
                }`}
              >
                <Link to={`/reviews/`}>Reviews</Link>
              </li>
            </ul>

            <div
              onClick={(e: MouseEvent) => {
                e.stopPropagation()
                setShowProfileDropdown(!showProfileDropdown)
              }}
              className="cursor-pointer relative"
            >
              <img
                src={UserIcon}
                alt="hamburger icon"
                className="rounded-full w-10 h-10 border-2 border-transparent"
              />
              {showProfileDropdown && (
                <div className="absolute top-10 -right-6 bg-white z-10 p-4 shadow-lg rounded-md">
                  <ul className={`text-base text-gray-700`}>
                    <li>
                      <Link to={`/users/${siteUser.id}/profile`}>Profile</Link>
                    </li>
                    <li
                      onClick={() => {
                        if (process.env.REACT_APP_AUTH_METHOD === "Token") {
                          // @ts-ignore
                          localStorage.setItem("token", null) // typescript doesn't like setting localstorage item to 'null' but it's fine
                          client.writeQuery({
                            query: GET_CURRENT_USER,
                            data: {
                              currentUser: AnonUser
                            }
                          })
                        } else if (
                          process.env.REACT_APP_AUTH_METHOD === "Cookie"
                        ) {
                          // send message to the server to destroy session
                          logout && logout()
                        }
                      }}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Toolbar
