import React, { FC, useEffect, useState } from "react"
import { CurrentUser } from "types"
import { useParams, Redirect } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/client"
import { useForm } from "react-yup"
import { UPDATE_USER } from "gql/mutations"
import {
  GET_CURRENT_USER,
  GET_USER_BY_ID,
  GET_USER_NAME_AND_ROLE
} from "gql/queries"
import * as yup from "yup"
import { UserRole } from "generated/graphql-frontend"

interface IProps {
  siteUser: CurrentUser
}

interface ParamTypes {
  id: string
}

const classes = {
  field:
    "w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out",
  button:
    "bg-green-400 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark"
}

// hmm might be more trouble that it's worth for small forms
const updateValidationSchema = yup
  .object({
    name: yup
      .string()
      .required("Username is a required field")
      .min(3, "Username must be at least 3 characters"),
    email: yup
      .string()
      .email("Not a valid email address")
      .required("Email is a required field"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^\S*$/, // in real life this would be more complicated
        "Password cannot contain spaces"
      ),
    passwordRepeat: yup.string().when("password", {
      is: (password: string) =>
        password && password.length > 0 ? true : false,
      then: yup.string().oneOf([yup.ref("password")], "Password doesn't match")
    })
  })
  .defined()

const UserProfilePage: FC<IProps> = ({ siteUser }) => {
  const [invalidForm, setInvalidForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  let { id } = useParams<ParamTypes>()

  const { values, setValues, errors, field, touched, createSubmitHandler } =
    useForm({
      validationSchema: updateValidationSchema
    })

  // get the user of the userpage.
  // if user is unauthorized, they will be redirected below
  const {
    loading,
    error,
    data: { getUser: { name, email } } = {
      getUser: { name: "", email: "" }
    }
  } = useQuery<{
    getUser: { name: string; email: string }
  }>(GET_USER_BY_ID, {
    variables: {
      id
    }
  })

  // set the default form options
  useEffect(() => {
    setValues((v) => {
      return {
        ...v,
        name,
        email
      }
    }, true)
  }, [name, email])

  // tricky to test for errors wiht this library for UI purposes ..
  useEffect(() => {
    let invalidField = Object.keys(errors).find((error) => {
      return errors[error] !== undefined
    })

    if (invalidField) {
      setInvalidForm(true)
    } else {
      setInvalidForm(false)
    }

    // still one edge case.. whether passwords match.
    // this library doesn't check for errors until something is entered .. I want it to check right away
    // so that particualr error is handled manually, UI-wise
  }, [errors])

  const [updateUser, { data }] = useMutation(UPDATE_USER, {
    // a more database efficient way to do this would be to use 'writeQuery'
    // or create custom hook that calls it like in the docs
    // .. but time is a little bit at a preminum!
    refetchQueries: [
      { query: GET_USER_BY_ID, variables: { id } },
      { query: GET_CURRENT_USER },
      { query: GET_USER_NAME_AND_ROLE, variables: { id } }
    ],
    onCompleted: (data) => {
      setShowError(false)
      setShowSuccess(true)
    },
    onError: (error) => {
      console.log(error)
      setShowError(true)
      setShowSuccess(false)
    }
  })

  const onSubmit = React.useMemo(() => {
    return createSubmitHandler(
      (values) => {
        let { passwordRepeat, ...data } = values

        setShowError(false)
        setShowSuccess(false)

        updateUser({
          variables: {
            id: siteUser.id,
            data: { idToUpdate: id, ...data }
          }
        })
      },
      (errors, values, yupErrors) => {
        setShowError(true)
      }
    )
  }, [])

  // if (id !== siteUser.id && siteUser.role !== UserRole.Admin) {
  //   return <Redirect to={`/users/${id}/reviews`} />
  // }

  return (
    <div className="flex items-center flex-col">
      <div></div>
      {showSuccess && (
        <p className="text-lg text-center text-green-500">Update Successful!</p>
      )}
      {showError && (
        <p className="text-lg text-center text-red-400">
          Something went wrong!
        </p>
      )}
      <form onSubmit={onSubmit} className="w-1/2">
        <div className="mb-4">
          <label htmlFor="name">UserName</label>
          <input
            id="name"
            name="name"
            value={(values.name as string) || ""}
            placeholder="User Name"
            className={`${classes.field} ${errors.name ? "bg-red-100" : ""}`}
            onChange={field.onChange}
          />
          {errors.name && (
            <p className="text-sm  text-red-400">{errors.name}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={(values.email as string) || ""}
            placeholder="Your Email"
            className={`${classes.field}  ${errors.email ? "bg-red-100" : ""}`}
            onChange={field.onChange}
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Your Password"
            value={(values.password as string) || ""}
            onChange={field.onChange}
            className={`${classes.field}  ${
              errors.password ? "bg-red-100" : ""
            }`}
          />
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Repeat Password</label>
          <input
            type="password"
            id="passwordRepeat"
            name="passwordRepeat"
            placeholder="Repeat Password"
            value={(values.passwordRepeat as string) || ""}
            onChange={field.onChange}
            className={`${classes.field}  ${
              values.password !== values.passwordRepeat ? "bg-red-100" : ""
            }`}
          />
          {values.password !== values.passwordRepeat && (
            <p className="text-sm text-red-400">Passwords do not match</p>
          )}
        </div>

        <div className="flex justify-center items-center mt-6">
          <button
            disabled={
              invalidForm || values.password !== values.passwordRepeat
                ? true
                : false
            }
            className={`${classes.button} ${
              invalidForm || values.password !== values.passwordRepeat
                ? "opacity-30 cursor-default"
                : ""
            }`}
          >
            Update Info
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserProfilePage
