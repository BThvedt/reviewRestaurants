import React from "react"

const Login = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log("form submitted")

    // let email = e.target.elements.email?.value
    // let password = e.target.elements.password?.value

    // console.log(email, password)
  }

  return (
    <>
      <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
        Sign up for an account
      </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Your Email"
            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Your Password"
            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
          />
        </div>
        <div>
          <label htmlFor="password">Repeat Password</label>
          <input
            type="password"
            id="password"
            placeholder="Repeat Password"
            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
          />
        </div>

        <div className="flex justify-center items-center mt-6">
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
