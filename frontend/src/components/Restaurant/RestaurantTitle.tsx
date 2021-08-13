import React, { FC } from "react"
import ReactStars from "react-rating-stars-component"
import { Link } from "react-router-dom"

interface IProps {
  name: string
  id: string
  num_of_reviews?: number | null
  num_of_ratings?: number | null
  average_rating?: number | null
}

const RestaurantTitle: FC<IProps> = ({
  name,
  id,
  num_of_reviews,
  num_of_ratings,
  average_rating
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <Link to={`/restaurants/${id}`}>
        <div className="flex flex-col group">
          <h1 className="text-lg font-bold text-gray-600 group-hover:text-green-500">
            {name}
          </h1>
          <p className="text-sm group-hover:text-green-500">
            {num_of_reviews} {`Review${num_of_reviews !== 1 ? "s" : ""}`}
          </p>
        </div>
      </Link>
      <div className="flex justify-start items-start">
        <div>
          <div>
            <h3 className="mr-3 relative top-0">
              {average_rating
                ? `Average Rating: ${average_rating.toFixed(2)} `
                : "No Ratings"}
            </h3>
          </div>

          {num_of_ratings !== 0 && (
            <p className="text-sm">
              {num_of_ratings} {`Rating${num_of_ratings !== 1 ? "s" : ""}`}
            </p>
          )}
        </div>

        <div className="relative bottom-3">
          <ReactStars
            count={5}
            size={30}
            edit={false}
            color={"#ddd"}
            activeColor="#818cf8"
            isHalf={true}
            value={average_rating ? Math.round(average_rating * 2) / 2 : 0}
          />
        </div>
      </div>
    </div>
  )
}

export default RestaurantTitle
