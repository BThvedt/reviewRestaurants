import React, { FC } from "react"

import Reviews from "./Reviews/Reviews"
import Users from "./Users/Users"
import Restaurants from "./Restaurants/Restaurants"
import { CurrentUser } from "types"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { UserRedirectLogic } from "components"
// import { UserRole } from "generated/graphql-frontend"

// import Toolbar from "../../components/Toolbar/Toolbar"

interface IProps {
  siteUser: CurrentUser
}

const AuthorizedSection: FC<IProps> = ({ siteUser }) => {
  return (
    <div className="md:w-3/5 mx-auto">
      <Switch>
        <Route path="/users">
          <Users siteUser={siteUser} />
        </Route>
        <Route path="/reviews">
          <Reviews siteUser={siteUser} />
        </Route>
        <Route path="/restaurants">
          <Restaurants siteUser={siteUser} />
        </Route>
        <Route path="/*">
          <UserRedirectLogic siteUser={siteUser} />
        </Route>
      </Switch>
    </div>
  )
}

export default AuthorizedSection
