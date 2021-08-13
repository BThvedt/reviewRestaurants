import React, { FC, useState } from "react"
import { LOGIN } from "gql/mutations"
import { useMutation } from "@apollo/client"
import { CurrentUser } from "types"

interface IProps {
  onSignIn: (currentUser: CurrentUser) => void
}

const Login: FC<IProps> = ({ onSignIn }) => {
  console.log(
    'hmm... change from "any" once i start gettting errors back and know what i wannna do'
  )
  const [loginErrors, setLoginErrors] = useState<any[]>([])
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const [login, { data: loginData }] = useMutation(LOGIN, {
    async onCompleted(loginData) {
      const { login: result } = loginData

      setLoginErrors([])

      // The logic of whether it's a token or a cookie happen in "Container"

      onSignIn(result)
    },
    onError(err) {
      let returnedErrors = err.graphQLErrors as any
      let loginErrors: any[] = []

      returnedErrors.forEach((err: any, i: number) => {
        let { status, message, reasons } = err
        loginErrors.push({
          status,
          message,
          reasons
        })
      })

      setLoginErrors(
        returnedErrors.map((err: any, i: number) => {
          let { status, message, reasons } = err
          loginErrors.push({
            status,
            message,
            reasons
          })
        })
      )
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    login({ variables: { data: { email, password } } })
  }
  const classes = {
    pageBody: "h-1/2 flex bg-gray-bg1",
    formContainer: "w-full max-w-md m-auto ",
    formContainerInner:
      "bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16",
    formHeading: "text-2xl  font-medium text-primary mt-4 mb-12 text-center",
    btnContainer: "flex justify-center items-center mt-6"
  }
  return (
    <>
      <h1 className={classes.formHeading}>Log in to your account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Your Email"
            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Your Password"
            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </div>

        <div className={classes.btnContainer}>
          <button
            className={`bg-green-400 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
          >
            Login
          </button>
        </div>
      </form>
    </>
  )
}

export default Login
