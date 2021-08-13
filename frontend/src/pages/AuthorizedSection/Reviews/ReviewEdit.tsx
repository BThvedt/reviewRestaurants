import React, { FC } from "react"
import { useParams } from "react-router-dom"

interface ParamTypes {
  id: string
}

let ReviewEdit: FC = () => {
  let { id } = useParams<ParamTypes>()

  return <>Review Edit {id}</>
}

export default ReviewEdit
