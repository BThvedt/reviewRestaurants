import React, { FC } from "react"
import { CurrentUser } from "types"
import { UserRole } from "generated/graphql-frontend"

interface IProps {
  siteUser: CurrentUser
}

/* 
  For Admins Only! Whatcha doin' here
*/

let UserList: FC<IProps> = ({ siteUser }) => {
  return (
    <>
      {siteUser.role === UserRole.Admin ? (
        <>This is the users list</>
      ) : (
        <>Unauthorized</>
      )}
    </>
  )
}

export default UserList
