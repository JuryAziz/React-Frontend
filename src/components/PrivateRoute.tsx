import { ReactElement } from "react"
import { Navigate } from "react-router-dom"
import jwt from "jwt-decode"
import { DecodedToken, ROLE } from "@/types"
import Dashboard from "@/pages/Dashboard"
import Cart from "./user/cart"

export default function PrivateRoute({ children }: { children: ReactElement }) {
  const token = localStorage.getItem("token")

  // not logged in
  if (!token && children.type === Cart) return <Navigate to="/login" />
  if (!token) return <Navigate to="/" />

  const decodedToken = jwt<DecodedToken>(token)

  // todo: fix typing
  const decodedUser: any = {}

  for (const [key, value] of Object.entries(decodedToken)) {
    if (key === "nameid" && Array.isArray(value)) {
      decodedUser[key] = value[0]
      decodedUser["role"] = value[1] === "Admin" ? "Admin" : "User"
      continue
    }
    decodedUser[key] = value.toString()
  }

  if (decodedUser.role === ROLE.User && children.type === Dashboard) return <Navigate to="/" />

  return children
}
