import React, { FC } from "react"
import AllRestaurants from "./AllRestaurants"
import OwnerRestaurantList from "./OwnerRestaurantList"
import { CurrentUser } from "types"
import { TitleOrMenu } from "components"
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"
import { UserRole } from "generated/graphql-frontend"

interface IProps {
  siteUser: CurrentUser
}

let RestaurantListPage: FC<IProps> = ({ siteUser }) => {
  return (
    <>
      <TitleOrMenu
        titlesAndLinks={[
          {
            title: "My Restaurants",
            link: "/restaurants/mine"
          },
          {
            title: "All Restaurants",
            link: "/restaurants"
          }
        ]}
        title="Restaurants"
        showMenu={
          siteUser.role === UserRole.RestaurantOwner ||
          siteUser.role === UserRole.Admin
        }
      />

      <Switch>
        <Route exact path={["/restaurants", "/restaurants/"]}>
          <AllRestaurants />
        </Route>
        <Route path="/restaurants/mine">
          <OwnerRestaurantList siteUser={siteUser} />
        </Route>
      </Switch>
    </>
  )
}

export default RestaurantListPage
