import React, { useState } from "react"
import {
  Toolbar,
  ProgressBar as SiteLoadingProgresBar,
  UserRedirectLogic
} from "components"
import { Login, AuthorizedSection } from "pages"
import { AnonUser } from "types"
import { GET_CURRENT_USER } from "gql/queries"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import { useQuery } from "@apollo/client"
import { useEffect } from "react"

const defaultUserData = {
  getUser: AnonUser
}

function App() {
  const [bodyClickToggle, setBodyClickToggle] = useState(true)

  const {
    loading,
    error,
    data: { currentUser: user } = defaultUserData
  } = useQuery(GET_CURRENT_USER)

  return (
    <div
      className="bg-gray-100 min-h-screen h-full"
      onClick={() => setBodyClickToggle(!bodyClickToggle)}
    >
      <Router>
        <Toolbar siteUser={user} bodyClickToggle={bodyClickToggle} />
        {/* 
        Dropped due to time constraints .. come back later to finish
        {!user?.id && (
          <SiteLoadingProgresBar
            steps={3}
            currentStep={loadingStep}
            duration={200}
          />
        )} */}

        <Switch>
          <Route exact path="/">
            {user?.id && <UserRedirectLogic siteUser={user} />}
            <Login />
          </Route>
          <Route path="/*">
            {!loading && !user?.id && <Redirect to="/" />}
            {user?.id && <AuthorizedSection siteUser={user} />}
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
