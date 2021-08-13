import React, { FC } from "react"
import RestaurantListPage from "./RestaurantListPage/RestaurantListPage"
import RestaurantDetail from "./RestaurantDetail"
import { CurrentUser } from "types"
import { Route, Switch } from "react-router-dom"

interface IProps {
  siteUser: CurrentUser
}

let Restaurant: FC<IProps> = ({ siteUser }) => {
  return (
    <Switch>
      <Route
        exact
        path={["/restaurants", "/restaurants/", "/restaurants/mine"]}
      >
        <RestaurantListPage siteUser={siteUser} />
      </Route>
      <Route exact path="/restaurants/:id">
        <RestaurantDetail siteUser={siteUser} />
      </Route>
    </Switch>
  )
}

export default Restaurant
