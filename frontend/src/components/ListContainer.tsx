import React, { FC } from "react"
import { useLocation, Link } from "react-router-dom"

let ListContainer: FC = ({ children }) => {
  const location = useLocation()
  return (
    <div className=" bg-white w-full mb-5 p-2 shadow-sm rounded-md relative">
      {children}
    </div>
  )
}

export default ListContainer
