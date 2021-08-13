import React, { FC } from "react"
import AllReviews from "./AllReviews"
import MyReviews from "./MyReviews"
import { CurrentUser } from "types"
import { TitleOrMenu } from "components"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { UserRole } from "generated/graphql-frontend"

interface IProps {
  siteUser: CurrentUser
}

let ReviewListPage: FC<IProps> = ({ siteUser }) => {
  return (
    <>
      <TitleOrMenu
        titlesAndLinks={[
          {
            title: "My Reviews",
            link: "/reviews/mine"
          },
          {
            title: "All Reviews",
            link: "/reviews"
          }
        ]}
        title="Reviews"
        showMenu={
          siteUser.role === UserRole.RestaurantOwner ||
          siteUser.role === UserRole.Admin
        }
      />

      <Switch>
        <Route exact path={["/reviews", "/reviews/"]}>
          <AllReviews siteUser={siteUser} />
        </Route>
        <Route path="/reviews/mine">
          <MyReviews siteUser={siteUser} />
        </Route>
      </Switch>
    </>
  )
}

export default ReviewListPage
