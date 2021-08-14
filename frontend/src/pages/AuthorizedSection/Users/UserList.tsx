import React, { FC, useState, useEffect } from "react"
import { CurrentUser } from "types"
import { UserRole, User, UserReturnData } from "generated/graphql-frontend"
import Pager from "components/Pager"
import { Redirect, Link } from "react-router-dom"
import { useQuery, useMutation } from "@apollo/client"
import { GET_USERS } from "gql/queries"
import { DELETE_USER, UPDATE_USER } from "gql/mutations"

interface IProps {
  siteUser: CurrentUser
}

/* 
  Hey! This page is for Admins Only! Whatcha doin' here
*/

let UserList: FC<IProps> = ({ siteUser }) => {
  const [page, setPage] = useState(0)
  const [userList, setUserList] = useState<User[]>([])
  const [userCount, setUserCount] = useState(0)

  const [deleteUser, { data }] = useMutation(DELETE_USER, {
    refetchQueries: [
      {
        query: GET_USERS,
        variables: {
          data: {
            page: page,
            recordsPerPage: 15
          }
        }
      }
    ],
    onCompleted: (data) => {
      alert("user deleted")
    },
    onError: (error) => {
      console.log(error)
      alert("There was an error deleting that user")
    }
  })

  const {
    loading,
    error,
    data: { getUsers: { count, users } } = { getUsers: { count: 0, users: [] } }
  } = useQuery<{
    getUsers: UserReturnData
  }>(GET_USERS, {
    variables: {
      data: {
        page: page,
        recordsPerPage: 15
      }
    }
  })

  useEffect(() => {
    if (!loading && count) {
      setUserCount(count)
    }

    if (!loading && users.length) {
      setUserList(users)
    }
  }, [count, users, loading])

  if (error) {
    return <p>Something went wrong</p>
  }

  if (siteUser.role !== UserRole.Admin) {
    // this'll redirect those pesky unauthorized users to whatever their 'home page' is!
    return <Redirect to={"/"} />
  }

  return (
    <>
      {userList.length !== 0 && (
        <div>
          <h1 className="text-center text-2xl font-bold m-4 mb-2">
            Site Users
          </h1>
          <p className=" text-center mb-6">For Admin Eyes Only!</p>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <p>
                {15 * page + 1}-{15 * page + users.length} of {userCount}
              </p>
            </div>

            <Pager
              forcePage={page}
              setPage={setPage}
              count={userCount}
              itemsPerPage={15}
            />
          </div>

          <div className="flex justify-between mb-4 pb-2">
            <p className="text-lg font-bold w-1/4 text-left pl-10">Name</p>
            <p className="text-lg font-bold w-1/4 text-left">Role</p>
            <p className="text-lg font-bold w-1/4 text-center">Email</p>
            <p className="text-lg font-bold w-1/4 text-right pr-10">Edit</p>
          </div>
          <div>
            {userList.map((user, i) => (
              <div
                className={`flex justify-between mb-4  pb-2 ${
                  i !== userList.length - 1 ? "border-b-2 border-gray-300" : ""
                }`}
              >
                <p className="w-1/4">{user.name}</p>
                <p className="w-1/4">{user.role}</p>
                <p className="w-1/4">{user.email}</p>
                <div className="w-1/4 justify-end flex">
                  <p className="mr-3 cursor-pointer hover:text-green-400">
                    <Link to={`/users/${user.id}/profile`}>Edit</Link>
                  </p>
                  <p
                    className="mr-3 cursor-pointer hover:text-red-400"
                    onClick={() => {
                      if (window.confirm("Really delete this user?")) {
                        deleteUser({
                          variables: {
                            id: user.id
                          }
                        })
                      }
                    }}
                  >
                    Delete
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-3 mb-3">
            {userCount && (
              <Pager
                forcePage={page}
                setPage={setPage}
                count={userCount}
                itemsPerPage={15}
              />
            )}
          </div>
        </div>
      )}
      {!loading && users.length === 0 && <p>There are literally no users</p>}
    </>
  )
}

export default UserList
