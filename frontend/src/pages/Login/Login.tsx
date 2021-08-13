import React, { useState } from "react"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import CountUp from "react-countup"
import { GET_CURRENT_USER } from "gql/queries"
import { LOGIN, LOGOUT } from "gql/mutations"
import { CurrentUser, TokenPayload, AnonUser } from "types"
import { GET_COUNTS } from "gql/queries"
import {
  useQuery,
  useMutation,
  useApolloClient,
  useLazyQuery
} from "@apollo/client"

const Login = () => {
  let [formShowing, setFormShowing] = useState("Login")

  const client = useApolloClient()

  const onSignIn = (userData: CurrentUser | TokenPayload): void => {
    let loggedInUser

    if (process.env.REACT_APP_AUTH_METHOD === "Token") {
      localStorage.setItem("token", (userData as TokenPayload).token)
      loggedInUser = (userData as TokenPayload).user
    } else {
      loggedInUser = userData
    }

    client.writeQuery({
      query: GET_CURRENT_USER,
      data: {
        currentUser: loggedInUser as CurrentUser
      }
    })
  }

  // Admitidally, I'm not sure if I'm typing these 'useQuerys' corectly but it does seem to work
  const {
    loading: countLoading,
    error: countError,
    data: {
      getRestaurantCount: numOfRestaurants,
      getReviewCount: numOfReviews
    } = { getRestaurantCount: 0, getReviewCount: 0 }
  } = useQuery<{ getRestaurantCount: number; getReviewCount: number }>(
    GET_COUNTS
  )

  return (
    <>
      <div style={{ minHeight: "100px" }}>
        {!countLoading && numOfRestaurants && numOfReviews && (
          <h1 className="text-3xl font-medium px-8 pt-8  text-center">
            Login to see{" "}
            <span className="text-green-400 font-black">
              <CountUp end={numOfRestaurants} duration={3} />
            </span>{" "}
            Restaurants and{" "}
            <span className="text-green-400 font-black">
              <CountUp end={numOfReviews} duration={3} />
            </span>{" "}
            Reviews!
          </h1>
        )}
        <h3 className="text-xl font-medium px-8 pt-1 text-center">
          ..and counting...
        </h3>
      </div>
      <div className="h-3/5 flex py-4">
        <div className="w-full max-w-md m-auto ">
          <div className="bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
            {formShowing === "Login" && <LoginForm onSignIn={onSignIn} />}
            {formShowing === "Signup" && <SignupForm />}
          </div>
          <div className="flex justify-center">
            {formShowing === "Login" && (
              <p>
                Need an account?{" "}
                <span
                  className="text-blue-400 cursor-pointer"
                  onClick={() => setFormShowing("Signup")}
                >
                  Create One
                </span>
              </p>
            )}
            {formShowing === "Signup" && (
              <p>
                Already have an account?{" "}
                <span
                  className="text-blue-400 cursor-pointer"
                  onClick={() => setFormShowing("Login")}
                >
                  Log In
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
