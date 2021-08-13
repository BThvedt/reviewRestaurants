import React, { FC } from "react"
import UserList from "./UserList"
import UserPage from "./UserPage"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { UserRedirectLogic } from "components"
import { CurrentUser } from "types"

interface IProps {
  siteUser: CurrentUser
}

let User: FC<IProps> = ({ siteUser }) => {
  return (
    <>
      <Switch>
        <Route exact path={["/users", "/users/"]}>
          <UserList siteUser={siteUser} />
        </Route>
        <Route path="/users/:id">
          <UserPage siteUser={siteUser} />
        </Route>
        {/* <Route path="/*">
          <UserRedirectLogic siteUser={siteUser} />
        </Route> */}
      </Switch>
    </>
  )
}

export default User
