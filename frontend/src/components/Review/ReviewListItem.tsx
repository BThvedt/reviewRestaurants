import React, { FC } from "react"
import { Link } from "react-router-dom"
import { Review, Restaurant } from "generated/graphql-frontend"
import { CurrentUser } from "types"
import { ReviewListHeader, ListContainer, CommentReply } from "components"
import { FormatDate } from "lib"

interface IProps {
  review: Review
  restaurant?: Restaurant
  siteUser: CurrentUser
  replyTitleCentered?: boolean
  showRestaurantInfo?: boolean
  linkReviews?: boolean
}

let ReviewListItem: FC<IProps> = ({
  review,
  restaurant,
  siteUser,
  replyTitleCentered,
  showRestaurantInfo,
  linkReviews
}) => {
  return (
    <ListContainer>
      <div className="-mb-2 ">
        {showRestaurantInfo && restaurant && (
          <Link to={`/restaurants/${restaurant.id}`}>
            <div className="mb-1 group">
              <p className="text-xl group-hover:text-green-400">
                {restaurant.name}
              </p>
              <p className="text-sm group-hover:text-green-400">
                {restaurant.num_of_reviews}{" "}
                {`Review${restaurant.num_of_reviews || 0 > 1 ? "s" : ""}`}{" "}
                {restaurant.num_of_ratings}{" "}
                {`Rating${restaurant.num_of_ratings || 0 > 1 ? "s" : ""}`}
              </p>
              <p className="text-sm group-hover:text-green-400">
                Average Rating:{" "}
                <span className="font-bold">
                  {restaurant.average_rating?.toFixed(2)}{" "}
                </span>{" "}
                Stars
              </p>
            </div>
          </Link>
        )}
        <ReviewListHeader review={review} />
        {review.comment && <p className="mb-2">{review.comment.text}</p>}
        <div className="flex justify-between">
          {review.comment ? (
            <>
              {linkReviews ? (
                <Link to={`/users/${review.user?.id}/reviews`}>
                  <p className="text-sm pb-2 hover:text-green-400">
                    - {review.user?.name} (
                    {`${review.user?.num_of_reviews} Review${
                      review.user?.num_of_reviews || 0 > 1 ? "s" : ""
                    }`}
                    )
                  </p>
                </Link>
              ) : (
                <p className="text-sm pb-2">- {review.user?.name}</p>
              )}
            </>
          ) : (
            <p>
              {linkReviews ? (
                <Link to={`/users/${review.user?.id}/reviews`}>
                  <p className="text-sm pb-2 hover:text-green-400">
                    (
                    {`${review.user?.num_of_reviews} Review${
                      review.user?.num_of_reviews || 0 > 1 ? "s" : ""
                    }`}
                    )
                  </p>
                </Link>
              ) : (
                // <p className="text-sm pb-2">
                //   (
                //   {`${review.user?.num_of_reviews} Review${
                //     review.user?.num_of_reviews || 0 > 1 ? "s" : ""
                //   }`}
                //   )
                // </p>
                <p></p>
              )}
            </p>
          )}
          <p className="text-sm pb-2">
            Visited {FormatDate(new Date(review.visited))}
          </p>
        </div>
        <CommentReply
          review={review}
          restaurant={restaurant || undefined}
          siteUser={siteUser}
          titleCentered={replyTitleCentered || false}
        />
      </div>
    </ListContainer>
  )
}

export default ReviewListItem
