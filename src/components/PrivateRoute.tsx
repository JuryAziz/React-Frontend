import { ReactElement } from "react"
import { Navigate } from "react-router-dom"
import { ROLE } from "@/types"
import Dashboard from "@/pages/Dashboard"
import Cart from "./user/cart"
import { decodeUser } from "@/lib/utils"

export default function PrivateRoute({ children }: { children: ReactElement }) {
  const decodedUser = decodeUser()

  // not logged in
  if ( !decodedUser && children.type === Cart ) return <Navigate to="/login" />
  if (!decodedUser && children.type === Dashboard) return <Navigate to="/login" />
  if (!decodedUser) return <Navigate to="/" />

  if (decodedUser?.role === ROLE.User && children.type === Dashboard) return <Navigate to="/" />

  return children
}
