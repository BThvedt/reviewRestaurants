import React, { FC } from "react"
import { StringTrim } from "lib"
import ReactStars from "react-rating-stars-component"
import { Review } from "generated/graphql-frontend"

interface IProps {
  featured_review?: Review | null
  isPreview: boolean
}

const FeaturedReview: FC<IProps> = ({ featured_review, isPreview }) => {
  if (!featured_review) {
    return <></>
  }

  let { comment, rating, user } = featured_review

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text text-gray-600  ">
          <span className="font-bold">Featured Review: </span>
          {isPreview ? StringTrim(comment?.title, 40, true) : comment?.title}
        </h1>
        <div>
          <ReactStars
            count={5}
            size={20}
            edit={false}
            color={"#fff"}
            activeColor={"#aaa"}
            isHalf={true}
            value={rating?.stars ? Math.round(rating.stars * 2) / 2 : 0}
          />
        </div>
      </div>
      <div>
        <p className="text text-gray-600  text-sm ">
          {isPreview ? StringTrim(comment?.text, 260, true) : comment?.text}
        </p>
      </div>
      <div>
        <p className="text text-gray-600  text-sm ">- {user?.name}</p>
      </div>
    </>
  )
}

export default FeaturedReview
