import React, { FC } from "react"
import ReviewListPage from "./ReviewListPage"
import ReviewEdit from "./ReviewEdit"
import { CurrentUser } from "types"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

interface IProps {
  siteUser: CurrentUser
}

let Review: FC<IProps> = ({ siteUser }) => {
  return (
    <Switch>
      <Route exact path={["/reviews", "/reviews/", "/reviews/mine"]}>
        <ReviewListPage siteUser={siteUser} />
      </Route>
      <Route exact path="/reviews/:id">
        <ReviewEdit />
      </Route>
    </Switch>
  )
}

export default Review
