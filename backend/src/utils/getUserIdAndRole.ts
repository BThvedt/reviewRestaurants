import jwt, { JwtPayload } from "jsonwebtoken"
import { UserRole } from "../gql/Users/types"

const getUserIdAndRole = (
  req: any,
  requireAuth = true
): { userId: string; role: UserRole } => {
  let decoded: JwtPayload // not happy with this, but I'm typing the jwt.verfy decoding function ans any

  if (req.headers.authorization && process.env.AUTH_METHOD === "Token") {
    const authHeader = req.headers.authorization

    const token = authHeader.replace("Bearer ", "")

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    } catch (e) {
      throw new Error("Token is Invalid")
    }

    return { userId: decoded.userId, role: decoded.role }
  } else if (process.env.AUTH_METHOD === "Cookie" && req.session?.jwt) {
    const token = req.session?.jwt

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    } catch (e) {
      throw new Error("Token is invalid")
    }

    return { userId: decoded.userId, role: decoded.role }
  }

  if (requireAuth) {
    throw new Error("Authentication Required")
  } else {
    // basically assume this is an anonymous request and the user role is REGULAR
    return {
      userId: "",
      role: "REGULAR"
    }
  }

  throw new Error(`Authentication failed`)
}

export default getUserIdAndRole
