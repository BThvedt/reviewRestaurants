import { User, UserRole } from "generated/graphql-frontend"

export type CurrentUser = Omit<User, "password">

export interface TokenPayload {
  token: string
  user: CurrentUser
}

export const AnonUser = {
  id: "",
  name: "",
  email: "",
  role: UserRole.Regular
}
