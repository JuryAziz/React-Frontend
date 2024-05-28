import { useContext } from "react"
import { Link } from "react-router-dom"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "./ui/navigation-menu"

import { GlobalContext } from "@/App"
import { ROLE } from "@/types"
import { decodeUser } from "@/lib/utils"

export default function Navbar() {
  const context = useContext(GlobalContext)
  if (!context) throw new Error("No context provided")
  const { state, handleLogout } = context

  const role = decodeUser()?.role

  return (
    <div className="flex justify-center mb-20">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {role === ROLE.Admin && (
            <NavigationMenuItem>
              <Link to="/Dashboard">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
          {role === ROLE.User ? (
            <NavigationMenuItem>
              <Link to="/Cart">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Cart
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ) : state.user ? (
            <NavigationMenuItem>
              <Link to="/login">
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  onClick={() => {
                    localStorage.removeItem("token")
                    localStorage.removeItem( "user" )
                    handleLogout()
                  }}
                >
                  Logout
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <Link to="/login">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Login
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
