import React, { FC } from "react"
import { Children } from "react"
import { useLocation, Link } from "react-router-dom"

let PageHeader: FC = ({ children }) => {
  const location = useLocation()
  return (
    <div className="lg:px-16 px-6 flex flex-wrap items-center justify-center lg:py-0 py-2">
      {children}
    </div>
  )
}

export default PageHeader
