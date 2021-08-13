import React, { FC } from "react"
import { useLocation, Link } from "react-router-dom"

interface IProps {
  titlesAndLinks?:
    | {
        title: string
        link: string
      }[]

  title?: string
  showMenu?: boolean
}

let TitleOrMenu: FC<IProps> = ({ titlesAndLinks, title, showMenu }) => {
  const location = useLocation()
  return (
    <div className="lg:px-16 px-6 flex flex-wrap items-center justify-center lg:py-0 py-2">
      <ul className="flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0">
        {showMenu &&
          titlesAndLinks?.map(({ title, link }) => {
            return (
              <li
                key={link}
                className={`border-b-2 border-transparent hover:border-indigo-400 ${
                  location.pathname === link || location.pathname === `${link}/`
                    ? "border-indigo-400 "
                    : ""
                }`}
              >
                <Link to={link} className="p-3 block text-xl ">
                  <h2 className=" relative">{title}</h2>
                </Link>
              </li>
            )
          })}
        {!showMenu && (
          <li
            className={`border-b-2 border-transparent pb-1  mt-8 block text-3xl `}
          >
            {title}
          </li>
        )}
      </ul>
    </div>
  )
}

export default TitleOrMenu
