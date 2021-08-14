import React, { FC } from "react"
import { useParams, Route, Switch, Redirect } from "react-router-dom"
import { TitleOrMenu } from "components"
import { NameAndRoleData, UserRole } from "generated/graphql-frontend"
import { useQuery } from "@apollo/client"
import { GET_USER_NAME_AND_ROLE } from "gql/queries"
import UserReviews from "./UsersReviews"
import UserRestaurants from "./UsersRestaurants"
import UserProfile from "./UserProfile"
import { CurrentUser } from "types"

interface IProps {
  siteUser: CurrentUser
}

interface ParamTypes {
  id: string
}

let UserPage: FC<IProps> = ({ siteUser }) => {
  let { id } = useParams<ParamTypes>()

  const {
    loading,
    error,
    data: { getUserNameAndRole: nameAndRole } = {
      getUserNameAndRole: { name: "", role: "" }
    }
  } = useQuery<{ getUserNameAndRole: NameAndRoleData }>(
    GET_USER_NAME_AND_ROLE,
    {
      variables: {
        id
      }
    }
  )

  if (error) {
    return <p>Something went wrong</p>
  }

  let titlesAndLinks = [
    {
      title: "Reviews",
      link: `/users/${id}/reviews`
    },
    {
      title: "Restaurants",
      link: `/users/${id}/restaurants`
    }
  ]

  if (siteUser.id === id || siteUser.role === UserRole.Admin) {
    titlesAndLinks.push({
      title: "Profile",
      link: `/users/${id}/profile`
    })
  }

  return (
    <>
      <TitleOrMenu title={`${nameAndRole.name}`} showMenu={false} />

      {/* 
        Reviews are the default.. 
        optional items are profile (if current user) 
        and restuarnts (if they own restaurants)
        Also if it's your own profile, you can use 'Restaurants'
        to create restaurants. If you're not an owner,
      */}

      <TitleOrMenu
        titlesAndLinks={titlesAndLinks}
        title={`Reviews`}
        showMenu={
          nameAndRole.role === UserRole.RestaurantOwner ||
          siteUser.role === UserRole.Admin ||
          id === siteUser.id
        }
      />

      <Switch>
        <Route exact path={["/users/:id/reviews", "/users/:id/reviews/"]}>
          <UserReviews siteUser={siteUser} paramsId={id} />
        </Route>
        <Route path="/users/:id/restaurants">
          <UserRestaurants siteUser={siteUser} paramsId={id} />
        </Route>
        <Route path="/users/:id/profile">
          <UserProfile siteUser={siteUser} />
        </Route>
        {/* <Route path="/users/*">
          <Redirect to={`/users/${id}/reviews`} />
        </Route> */}
      </Switch>
    </>
  )
}

export default UserPage
