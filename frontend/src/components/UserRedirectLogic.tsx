import React, { FC } from "react"
import { CurrentUser } from "types"
import { UserRole } from "generated/graphql-frontend"
import { Redirect } from "react-router-dom"

interface RedirectLogicProps {
  siteUser: CurrentUser // we do not get this prop in isoation
}

const UserRedirectLogic: FC<RedirectLogicProps> = ({ siteUser }) => {
  return (
    <>
      {siteUser.role === UserRole.Regular && <Redirect to="/restaurants/" />}
      {siteUser.role === UserRole.RestaurantOwner && (
        <Redirect to="/restaurants/mine" />
      )}
      {siteUser.role === UserRole.Admin && <Redirect to="/users/" />}
    </>
  )
}

export default UserRedirectLogic
